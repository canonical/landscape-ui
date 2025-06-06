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
              .required("Confirm passphrase is required")
              .oneOf([Yup.ref("password"), ""], "Passphrases must match")
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
      try {
        const promises = [];
        if (groupsToBeAdded.length) {
          promises.push(
            addUserToGroupMutation({
              computer_id: instanceId,
              groupnames: groupsData
                .filter((g) => groupsToBeAdded.includes(String(g.gid)))
                .map((g) => g.name),

              usernames: [values.username],
              action: "add",
            }),
          );
        }
        if (groupsToBeRemoved.length) {
          promises.push(
            removeUserFromGroupMutation({
              computer_id: instanceId,
              groupnames: groupsData
                .filter((g) => groupsToBeRemoved.includes(String(g.gid)))
                .map((g) => g.name),

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
        error={
          formik.touched.username && formik.errors.username
            ? formik.errors.username
            : undefined
        }
        {...formik.getFieldProps("username")}
      />
      <Input
        type="text"
        label="Name"
        error={
          formik.touched.name && formik.errors.name
            ? formik.errors.name
            : undefined
        }
        {...formik.getFieldProps("name")}
      />
      <Input
        type="password"
        label="Passphrase"
        autoComplete="new-password"
        error={
          formik.touched.password && formik.errors.password
            ? formik.errors.password
            : undefined
        }
        {...formik.getFieldProps("password")}
      />
      <Input
        type="password"
        label="Confirm passphrase"
        autoComplete="new-password"
        error={
          formik.touched.confirmPassword && formik.errors.confirmPassword
            ? formik.errors.confirmPassword
            : undefined
        }
        {...formik.getFieldProps("confirmPassword")}
      />
      <Select
        data-testid="primaryGroupValue"
        label="Primary Group"
        required
        disabled={isLoadingGroups}
        options={groups}
        {...formik.getFieldProps("primaryGroupValue")}
        error={
          formik.touched.primaryGroupValue && formik.errors.primaryGroupValue
            ? formik.errors.primaryGroupValue
            : undefined
        }
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
        error={
          (formik.touched.additionalGroupValue &&
            (Array.isArray(formik.errors.additionalGroupValue)
              ? formik.errors.additionalGroupValue.join(", ")
              : formik.errors.additionalGroupValue)) ||
          undefined
        }
      />
      <Input
        type="text"
        label="Location"
        error={
          formik.touched.location && formik.errors.location
            ? formik.errors.location
            : undefined
        }
        {...formik.getFieldProps("location")}
      />
      <Input
        type="text"
        label="Home phone"
        error={
          formik.touched.homePhoneNumber && formik.errors.homePhoneNumber
            ? formik.errors.homePhoneNumber
            : undefined
        }
        {...formik.getFieldProps("homePhoneNumber")}
      />
      <Input
        type="text"
        label="Work phone"
        error={
          formik.touched.workPhoneNumber && formik.errors.workPhoneNumber
            ? formik.errors.workPhoneNumber
            : undefined
        }
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
