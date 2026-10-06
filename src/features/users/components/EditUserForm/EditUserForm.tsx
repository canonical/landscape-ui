import ReadOnlyField from "@/components/form/ReadOnlyField";
import MultiSelectField from "@/components/form/MultiSelectField";
import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import { useOpenActivityDetailsPanel } from "@/features/activities";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import { ROUTES } from "@/libs/routes";
import type { UrlParams } from "@/types/UrlParams";
import type { User } from "@/types/User";
import { capitalize } from "@/utils/_helpers";
import { getFormikError } from "@/utils/formikErrors";
import { Form, Input, Notification, Select } from "@canonical/react-components";
import { useFormik } from "formik";
import type { FC } from "react";
import { Link, useParams } from "react-router";
import {
  useAddUserToGroup,
  useEditUser,
  useGetGroups,
  useGetUserActivities,
  useGetUserGroups,
  useRemoveUserFromGroup,
} from "../../api";
import type { UserProfileField } from "../../api";
import { getPendingUserActivityMessage } from "../../constants";
import { editUserValidationSchema } from "./constants";
import {
  buildEditUserPayload,
  getEditUserInitialValues,
  getGroupDifferences,
  getGroupNamesByGids,
  hasEditUserChanges,
} from "./helpers";
import classes from "./EditUserForm.module.scss";
import type { EditUserFormValues } from "./types";
import UserActivityLink from "./UserActivityLink";

interface EditUserFormProps {
  readonly user: User;
  readonly onError?: (message: string) => void;
}

const EditUserForm: FC<EditUserFormProps> = ({ user, onError }) => {
  const { instanceId: urlInstanceId, childInstanceId } = useParams<UrlParams>();
  const debug = useDebug();
  const { notify } = useNotify();
  const { closeSidePanel } = useSidePanel();
  const openActivityDetails = useOpenActivityDetailsPanel();
  const { editUser } = useEditUser();
  const { addUserToGroup } = useAddUserToGroup();
  const { removeUserFromGroup } = useRemoveUserFromGroup();

  const instanceId = Number(childInstanceId ?? urlInstanceId);

  const { groups: groupsData, isLoadingGroups } = useGetGroups({
    computer_id: instanceId,
  });
  const { userGroups: userGroupsData } = useGetUserGroups({
    username: user.username,
    computer_id: instanceId,
  });
  const { userActivities, isFetchingUserActivities } = useGetUserActivities({
    username: user.username,
    computer_id: instanceId,
  });
  const initialUserAdditionalGroups = userGroupsData.map((group) =>
    String(group.gid),
  );

  const groups = groupsData.map((group) => ({
    label: group.name,
    value: String(group.gid),
  }));

  const getLatestProfileActivityEvent = (field: UserProfileField) =>
    isFetchingUserActivities
      ? undefined
      : userActivities.find((event) =>
          event.changes.some(
            (change) => change.kind === "profile" && change.field === field,
          ),
        );
  const latestAdditionalGroupActivityEvent = isFetchingUserActivities
    ? undefined
    : userActivities.find((event) =>
        event.changes.some((change) => change.kind === "additional_group"),
      );
  const latestProfileActivityEvents = {
    name: getLatestProfileActivityEvent("name"),
    password: getLatestProfileActivityEvent("password"),
    primaryGroup: getLatestProfileActivityEvent("primary_group"),
    location: getLatestProfileActivityEvent("location"),
    homePhone: getLatestProfileActivityEvent("home_phone"),
    workPhone: getLatestProfileActivityEvent("work_phone"),
  };
  const initialValues = getEditUserInitialValues(
    user,
    initialUserAdditionalGroups,
  );

  const formik = useFormik<EditUserFormValues>({
    initialValues,
    enableReinitialize: true,
    validationSchema: editUserValidationSchema,
    onSubmit: async (values) => {
      const { groupsToBeAdded, groupsToBeRemoved } = getGroupDifferences(
        values.additionalGroupValue,
        initialUserAdditionalGroups,
      );
      const addedGroupNames = getGroupNamesByGids(groupsData, groupsToBeAdded);
      const removedGroupNames = getGroupNamesByGids(
        groupsData,
        groupsToBeRemoved,
      );
      const [primaryGroupName] = getGroupNamesByGids(groupsData, [
        values.primaryGroupValue,
      ]);
      const usernames = [user.username];
      try {
        const activityRequests: {
          label: string;
          description: string;
          request: ReturnType<typeof editUser>;
        }[] = [];
        if (groupsToBeAdded.length) {
          activityRequests.push({
            label: "View added groups",
            description: "group changes",
            request: addUserToGroup({
              computer_id: instanceId,
              groupnames: addedGroupNames,
              usernames,
            }),
          });
        }
        if (groupsToBeRemoved.length) {
          activityRequests.push({
            label: "View removed groups",
            description: "group changes",
            request: removeUserFromGroup({
              computer_id: instanceId,
              groupnames: removedGroupNames,
              usernames,
            }),
          });
        }
        const editUserPayload = buildEditUserPayload(
          instanceId,
          user.username,
          values,
          initialValues,
          primaryGroupName,
        );
        if (hasEditUserChanges(editUserPayload)) {
          activityRequests.push({
            label: "View profile changes",
            description: "user details",
            request: editUser(editUserPayload),
          });
        }
        if (!activityRequests.length) {
          closeSidePanel();
          return;
        }
        const results = await Promise.allSettled(
          activityRequests.map(async ({ label, description, request }) => {
            const { data: activity } = await request;
            return { activity, label, description };
          }),
        );
        const activities = results
          .filter((result) => result.status === "fulfilled")
          .map((result) => result.value);
        const failure = results.find((result) => result.status === "rejected");
        const failedChanges = [
          ...new Set(
            activityRequests
              .filter((_, index) => results[index]?.status === "rejected")
              .map(({ description }) => description),
          ),
        ];
        closeSidePanel();
        if (failure) {
          let failedChangesMessage = `Group changes for user ${user.username}`;
          if (failedChanges.includes("user details")) {
            failedChangesMessage = failedChanges.includes("group changes")
              ? `Group and user detail changes for ${user.username}`
              : `Changes to user details for ${user.username}`;
          }
          const message = `${failedChangesMessage} could not be queued. Please try again.`;
          if (onError) {
            onError(message);
          } else {
            debug(new Error(message, { cause: failure.reason }));
            return;
          }
        }
        if (activities.length) {
          const queuedChanges = [
            ...new Set(activities.map(({ description }) => description)),
          ]
            .map((description) =>
              failedChanges.includes(description)
                ? `some ${description}`
                : description,
            )
            .join(" and ");
          const queuedOperation = activities.some(
            ({ description }) => description === "user details",
          )
            ? "were queued for update"
            : "were queued";
          notify.success({
            title: failure
              ? `You queued changes for ${user.username}.`
              : `You queued ${user.username} to be edited.`,
            message: failure
              ? `${capitalize(queuedChanges)} for user ${user.username} ${queuedOperation}.`
              : `An activity is queued to edit ${user.username}.`,
            actions: activities.map(({ activity, label }) => ({
              label: activities.length === 1 ? "View details" : label,
              onClick: () => {
                openActivityDetails(activity);
              },
            })),
          });
        }
      } catch (error) {
        closeSidePanel();
        debug(error);
      }
    },
  });

  return (
    <Form
      className={classes.form}
      onSubmit={formik.handleSubmit}
      noValidate
      name="edit-user"
    >
      {user.pending_activity?.operation === "delete" && (
        <Notification inline severity="caution" title="User activity pending:">
          <span>
            {getPendingUserActivityMessage(
              user.pending_activity.operation,
            )}{" "}
          </span>
          <Link
            to={ROUTES.activities.root({
              query: `id:${user.pending_activity.activity_id}`,
            })}
            state={{
              activity: {
                id: user.pending_activity.activity_id,
                summary: user.pending_activity.summary,
              },
            }}
            onClick={closeSidePanel}
          >
            View activity
          </Link>
        </Notification>
      )}
      <ReadOnlyField
        label="Username"
        value={user.username}
        tooltipMessage="You can't change the username of an existing user."
      />
      <Input
        type="text"
        label="Name"
        caution={
          latestProfileActivityEvents.name ? (
            <UserActivityLink event={latestProfileActivityEvents.name} />
          ) : undefined
        }
        error={getFormikError(formik, "name")}
        {...formik.getFieldProps("name")}
      />
      <Input
        type="password"
        label="Password"
        autoComplete="new-password"
        caution={
          latestProfileActivityEvents.password ? (
            <UserActivityLink event={latestProfileActivityEvents.password} />
          ) : undefined
        }
        error={getFormikError(formik, "password")}
        {...formik.getFieldProps("password")}
      />
      <Input
        type="password"
        label="Confirm password"
        autoComplete="new-password"
        error={getFormikError(formik, "confirmPassword")}
        {...formik.getFieldProps("confirmPassword")}
      />
      <Select
        data-testid="primaryGroupValue"
        label="Primary Group"
        required
        disabled={isLoadingGroups}
        options={groups}
        caution={
          latestProfileActivityEvents.primaryGroup ? (
            <UserActivityLink
              event={latestProfileActivityEvents.primaryGroup}
            />
          ) : undefined
        }
        {...formik.getFieldProps("primaryGroupValue")}
        error={getFormikError(formik, "primaryGroupValue")}
      />
      <MultiSelectField
        variant="condensed"
        placeholder="Select groups"
        label="Additional Groups"
        caution={
          latestAdditionalGroupActivityEvent ? (
            <UserActivityLink event={latestAdditionalGroupActivityEvent} />
          ) : undefined
        }
        items={groups}
        selectedItems={groups.filter(({ value }) =>
          formik.values.additionalGroupValue.includes(value),
        )}
        onItemsUpdate={(items) => {
          formik.setFieldValue(
            "additionalGroupValue",
            items.map(({ value }) => value),
          );
        }}
        error={getFormikError(formik, "additionalGroupValue")}
      />
      <Input
        type="text"
        label="Location"
        caution={
          latestProfileActivityEvents.location ? (
            <UserActivityLink event={latestProfileActivityEvents.location} />
          ) : undefined
        }
        error={getFormikError(formik, "location")}
        {...formik.getFieldProps("location")}
      />
      <Input
        type="text"
        label="Home phone"
        caution={
          latestProfileActivityEvents.homePhone ? (
            <UserActivityLink event={latestProfileActivityEvents.homePhone} />
          ) : undefined
        }
        error={getFormikError(formik, "homePhoneNumber")}
        {...formik.getFieldProps("homePhoneNumber")}
      />
      <Input
        type="text"
        label="Work phone"
        caution={
          latestProfileActivityEvents.workPhone ? (
            <UserActivityLink event={latestProfileActivityEvents.workPhone} />
          ) : undefined
        }
        error={getFormikError(formik, "workPhoneNumber")}
        {...formik.getFieldProps("workPhoneNumber")}
      />
      <SidePanelFormButtons
        submitButtonLoading={formik.isSubmitting}
        submitButtonText="Save changes"
      />
    </Form>
  );
};

export default EditUserForm;
