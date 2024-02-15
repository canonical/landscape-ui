import { Form, Input, Select } from "@canonical/react-components";
import { useFormik } from "formik";
import { FC } from "react";
import * as Yup from "yup";
import SidePanelFormButtons from "../../../components/form/SidePanelFormButtons";
import useDebug from "../../../hooks/useDebug";
import useNotify from "../../../hooks/useNotify";
import useSidePanel from "../../../hooks/useSidePanel";
import useUsers from "../../../hooks/useUsers";
import { User } from "../../../types/User";

interface FormProps {
  name: string;
  username: string;
  password: string;
  confirmPassword: string;
  location: string;
  homePhoneNumber: string;
  workPhoneNumber: string;
  primaryGroupValue: number;
  additionalGroupValue: number[];
}

interface EditUserFormProps {
  instanceId: number;
  user: User;
}

const EditUserForm: FC<EditUserFormProps> = ({ instanceId, user }) => {
  const debug = useDebug();
  const { notify } = useNotify();
  const { closeSidePanel } = useSidePanel();
  const { editUserQuery, getGroupsQuery, addUserToGroupQuery } = useUsers();
  const { data, isLoading: isLoadingGroups } = getGroupsQuery({
    computer_id: instanceId,
  });
  const { mutateAsync: editUserMutation, isLoading: isEditingUser } =
    editUserQuery;
  const {
    mutateAsync: addUserToGroupMutation,
    isLoading: isAddingUserToGroup,
  } = addUserToGroupQuery;

  const groupsData = data?.data.groups ?? [];

  const groups = groupsData.map((group) => ({
    label: group.name,
    value: group.gid,
  }));

  const formik = useFormik<FormProps>({
    initialValues: {
      name: user.name,
      username: user.username,
      password: "",
      confirmPassword: "",
      location: user.location ?? "",
      homePhoneNumber: user.home_phone ?? "",
      workPhoneNumber: user.work_phone ?? "",
      primaryGroupValue: user.primary_gid,
      additionalGroupValue: [],
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
      primaryGroupValue: Yup.number().min(0, "This field is required"),
    }),
    onSubmit: async (values) => {
      try {
        const promises = [];
        if (values.additionalGroupValue.length > 0) {
          promises.push(
            addUserToGroupMutation({
              computer_id: instanceId,
              groupnames: values.additionalGroupValue.map(
                (gid) =>
                  groups.find((group) => group.value === Number(gid))!.label,
              ),
              usernames: [values.username],
              action: "add",
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
            primary_groupname: values.primaryGroupValue.toString(),
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
    <Form onSubmit={formik.handleSubmit} noValidate>
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
      <Select
        label="Additional Groups"
        disabled={isLoadingGroups}
        multiple
        options={groups}
        {...formik.getFieldProps("additionalGroupValue")}
        error={
          formik.touched.additionalGroupValue &&
          formik.errors.additionalGroupValue
            ? formik.errors.additionalGroupValue
            : undefined
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
        disabled={isEditingUser || isAddingUserToGroup}
        submitButtonText="Save changes"
        removeButtonMargin
      />
    </Form>
  );
};

export default EditUserForm;
