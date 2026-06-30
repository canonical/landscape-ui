import MultiSelectField from "@/components/form/MultiSelectField";
import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import type { UrlParams } from "@/types/UrlParams";
import type { User } from "@/types/User";
import { getFormikError } from "@/utils/formikErrors";
import { Form, Input, Select } from "@canonical/react-components";
import { useFormik } from "formik";
import type { FC } from "react";
import { useParams } from "react-router";
import {
  useAddUserToGroup,
  useEditUser,
  useGetGroups,
  useGetUserGroups,
  useRemoveUserFromGroup,
} from "../../api";
import { editUserValidationSchema } from "./constants";
import {
  getEditUserInitialValues,
  getGroupDifferences,
  getGroupNamesByGids,
} from "./helpers";
import type { EditUserFormValues } from "./types";

interface EditUserFormProps {
  readonly user: User;
}

const EditUserForm: FC<EditUserFormProps> = ({ user }) => {
  const { instanceId: urlInstanceId } = useParams<UrlParams>();
  const debug = useDebug();
  const { notify } = useNotify();
  const { closeSidePanel } = useSidePanel();
  const { editUser, isEditingUser } = useEditUser();
  const { addUserToGroup, isAddingUserToGroup } = useAddUserToGroup();
  const { removeUserFromGroup, isRemovingUserFromGroup } =
    useRemoveUserFromGroup();

  const instanceId = Number(urlInstanceId);

  const { groups: groupsData, isLoadingGroups } = useGetGroups({
    computer_id: instanceId,
  });
  const { userGroups: userGroupsData } = useGetUserGroups({
    username: user.username,
    computer_id: instanceId,
  });

  const groups = groupsData.map((group) => ({
    label: group.name,
    value: String(group.gid),
  }));
  const initialUserAdditionalGroups =
    userGroupsData?.map((group) => String(group.gid)) || [];

  const formik = useFormik<EditUserFormValues>({
    initialValues: getEditUserInitialValues(user, initialUserAdditionalGroups),
    validationSchema: editUserValidationSchema,
    onSubmit: async (values) => {
      const { groupsToBeAdded, groupsToBeRemoved } = getGroupDifferences(
        values.additionalGroupValue,
        initialUserAdditionalGroups,
      );
      const groupNames = getGroupNamesByGids(groupsData, groupsToBeAdded);
      const usernames = [values.username];
      try {
        const promises = [];
        if (groupsToBeAdded.length) {
          promises.push(
            addUserToGroup({
              computer_id: instanceId,
              groupnames: groupNames,
              usernames,
            }),
          );
        }
        if (groupsToBeRemoved.length) {
          promises.push(
            removeUserFromGroup({
              computer_id: instanceId,
              groupnames: groupNames,
              usernames,
            }),
          );
        }
        promises.push(
          editUser({
            computer_ids: [instanceId],
            name: values.name,
            username: values.username,
            password: values.password,
            location: values.location,
            home_phone: values.homePhoneNumber,
            work_phone: values.workPhoneNumber,
            primary_groupname: values.primaryGroupValue,
          }),
        );
        await Promise.all(promises);
        closeSidePanel();
        notify.success({ message: "User updated successfully" });
      } catch (error) {
        debug(error);
      }
    },
  });

  return (
    <Form onSubmit={formik.handleSubmit} noValidate name="edit-user">
      <Input
        type="text"
        label="Username"
        required
        autoComplete="new-username"
        error={getFormikError(formik, "username")}
        {...formik.getFieldProps("username")}
      />
      <Input
        type="text"
        label="Name"
        error={getFormikError(formik, "name")}
        {...formik.getFieldProps("name")}
      />
      <Input
        type="password"
        label="Password"
        autoComplete="new-password"
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
        {...formik.getFieldProps("primaryGroupValue")}
        error={getFormikError(formik, "primaryGroupValue")}
      />
      <MultiSelectField
        variant="condensed"
        placeholder="Select groups"
        label="Additional Groups"
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
        error={getFormikError(formik, "location")}
        {...formik.getFieldProps("location")}
      />
      <Input
        type="text"
        label="Home phone"
        error={getFormikError(formik, "homePhoneNumber")}
        {...formik.getFieldProps("homePhoneNumber")}
      />
      <Input
        type="text"
        label="Work phone"
        error={getFormikError(formik, "workPhoneNumber")}
        {...formik.getFieldProps("workPhoneNumber")}
      />
      <SidePanelFormButtons
        submitButtonDisabled={
          isEditingUser || isAddingUserToGroup || isRemovingUserFromGroup
        }
        submitButtonText="Save changes"
      />
    </Form>
  );
};

export default EditUserForm;
