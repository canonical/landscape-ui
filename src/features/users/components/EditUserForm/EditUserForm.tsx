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
import { Link, useNavigate, useParams } from "react-router";
import {
  useAddUserToGroup,
  useEditUser,
  useGetGroups,
  useGetUserActivities,
  useGetUserGroups,
  useRemoveUserFromGroup,
} from "../../api";
import type { UserProfileField } from "../../types";
import { getPendingUserActivityMessage } from "../../constants";
import { editUserValidationSchema } from "./constants";
import {
  buildEditUserPayload,
  getEditUserInitialValues,
  getGroupDifferences,
  getGroupNamesByGids,
  hasEditUserChanges,
  renderUserActivityLink,
} from "./helpers";
import classes from "./EditUserForm.module.scss";
import type { EditUserFormValues } from "./types";

interface EditUserFormProps {
  readonly user: User;
  readonly onError?: (message: string) => void;
}

const EditUserForm: FC<EditUserFormProps> = ({ user, onError }) => {
  const { instanceId: urlInstanceId, childInstanceId } = useParams<UrlParams>();
  const debug = useDebug();
  const { notify } = useNotify();
  const { closeSidePanel } = useSidePanel();
  const navigate = useNavigate();
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
          description: string;
          request: ReturnType<typeof editUser>;
        }[] = [];
        if (groupsToBeAdded.length) {
          activityRequests.push({
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
            description: "user details",
            request: editUser(editUserPayload),
          });
        }
        if (!activityRequests.length) {
          closeSidePanel();
          return;
        }
        const results = await Promise.allSettled(
          activityRequests.map(async ({ description, request }) => {
            const { data: activity } = await request;
            return { activity, description };
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
        if (failure) {
          if (!activities.length) {
            debug(failure.reason);
            return;
          }
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
            debug(failure.reason);
          }
        }
        closeSidePanel();
        const [firstActivity] = activities;
        if (firstActivity) {
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
            actions: [
              {
                label:
                  activities.length === 1 ? "View activity" : "View activities",
                onClick: () => {
                  if (activities.length === 1) {
                    openActivityDetails(firstActivity.activity);
                    return;
                  }
                  navigate(
                    ROUTES.activities.root({
                      query: activities
                        .map(({ activity }) => `parent-id:${activity.id}`)
                        .join(" OR "),
                    }),
                  );
                },
              },
            ],
          });
        }
      } catch (error) {
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
        required
        caution={renderUserActivityLink(latestProfileActivityEvents.name)}
        error={getFormikError(formik, "name")}
        {...formik.getFieldProps("name")}
      />
      <Input
        type="password"
        label="Password"
        autoComplete="new-password"
        caution={renderUserActivityLink(latestProfileActivityEvents.password)}
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
        caution={renderUserActivityLink(
          latestProfileActivityEvents.primaryGroup,
        )}
        {...formik.getFieldProps("primaryGroupValue")}
        error={getFormikError(formik, "primaryGroupValue")}
      />
      <MultiSelectField
        variant="condensed"
        placeholder="Select groups"
        label="Additional Groups"
        warning={renderUserActivityLink(latestAdditionalGroupActivityEvent)}
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
        caution={renderUserActivityLink(latestProfileActivityEvents.location)}
        error={getFormikError(formik, "location")}
        {...formik.getFieldProps("location")}
      />
      <Input
        type="text"
        label="Home phone"
        caution={renderUserActivityLink(latestProfileActivityEvents.homePhone)}
        error={getFormikError(formik, "homePhoneNumber")}
        {...formik.getFieldProps("homePhoneNumber")}
      />
      <Input
        type="text"
        label="Work phone"
        caution={renderUserActivityLink(latestProfileActivityEvents.workPhone)}
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
