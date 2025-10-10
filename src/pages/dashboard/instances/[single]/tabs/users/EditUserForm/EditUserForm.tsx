import { Form, Input, Select } from "@canonical/react-components";
import { useFormik } from "formik";
import type { FC } from "react";
import * as Yup from "yup";
import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import MultiSelectField from "@/components/form/MultiSelectField";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import useUsers from "@/hooks/useUsers";
import type { User } from "@/types/User";
import { useParams } from "react-router";
import type { UrlParams } from "@/types/UrlParams";
import { getFormikError } from "@/utils/formikErrors";

interface FormProps {
  name: string;
  username: string;
  password: string;
  confirmPassword: string;
  location: string;
  homePhoneNumber: string;
  workPhoneNumber: string;
  primaryGroupValue: string;
  additionalGroupValue: string[];
}

interface EditUserFormProps {
  readonly user: User;
}

const EditUserForm: FC<EditUserFormProps> = ({ user }) => {
  const { instanceId: urlInstanceId } = useParams<UrlParams>();
  const debug = useDebug();
  const { notify } = useNotify();
  const { closeSidePanel } = useSidePanel();
  const {
    editUserQuery,
    getGroupsQuery,
    getUserGroupsQuery,
    addUserToGroupQuery,
    removeUserFromGroupQuery,
  } = useUsers();

  const instanceId = Number(urlInstanceId);

  const { data, isLoading: isLoadingGroups } = getGroupsQuery({
    computer_id: instanceId,
  });
  const { data: userGroupsData } = getUserGroupsQuery({
    username: user.username,
    computer_id: instanceId,
  });
  const { mutateAsync: editUserMutation } = editUserQuery;
  const { mutateAsync: addUserToGroupMutation } = addUserToGroupQuery;
  const { mutateAsync: removeUserFromGroupMutation } = removeUserFromGroupQuery;

  const groupsData = data?.data.groups ?? [];
  const groups = groupsData.map((group) => ({
    label: group.name,
    value: String(group.gid),
  }));
  const initialUserAdditionalGroups =
    userGroupsData?.data.groups.map((group) => String(group.gid)) || [];

  const formik = useFormik<FormProps>({
    initialValues: {
      name: user.name ?? "",
      username: user.username,
      password: "",
      confirmPassword: "",
      location: user.location ?? "",
      homePhoneNumber: user.home_phone ?? "",
      workPhoneNumber: user.work_phone ?? "",
      primaryGroupValue: String(user.primary_gid),
      additionalGroupValue: initialUserAdditionalGroups,
    },
    validationSchema: Yup.object().shape({
      username: Yup.string().required("This field is required"),
      name: Yup.string(),
      password: Yup.string(),
      confirmPassword: Yup.string().when("password", ([password], schema) => {
        return password && password.length > 0
          ? schema
              .trim()
              .required("Confirm password is required")
              .oneOf([Yup.ref("password"), ""], "Passwords must match")
          : schema.notRequired();
      }),
      location: Yup.string(),
      homePhoneNumber: Yup.string(),
      workPhoneNumber: Yup.string(),
      primaryGroupValue: Yup.string().required("This field is required"),
      additionalGroupValue: Yup.array().of(Yup.string()),
    }),
    onSubmit: async (values) => {
      const groupsToBeAdded = values.additionalGroupValue.filter(
        (group) => !initialUserAdditionalGroups.includes(group),
      );
      const groupsToBeRemoved = initialUserAdditionalGroups.filter(
        (group) => !values.additionalGroupValue.includes(group),
      );
      const groupNames = groupsData
        .filter((g) => groupsToBeAdded.includes(String(g.gid)))
        .map((g) => g.name);
      try {
        const promises = [];
        if (groupsToBeAdded.length) {
          promises.push(
            addUserToGroupMutation({
              computer_id: instanceId,
              groupnames: groupNames,

              usernames: [values.username],
              action: "add",
            }),
          );
        }
        if (groupsToBeRemoved.length) {
          promises.push(
            removeUserFromGroupMutation({
              computer_id: instanceId,
              groupnames: groupNames,

              usernames: [values.username],
              action: "remove",
            }),
          );
        }
        promises.push(
          editUserMutation({
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
        submitButtonDisabled={formik.isSubmitting}
        submitButtonText="Save changes"
      />
    </Form>
  );
};

export default EditUserForm;
