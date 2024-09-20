import { Form, Input, Select } from "@canonical/react-components";
import { useFormik } from "formik";
import { FC } from "react";
import * as Yup from "yup";
import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import useDebug from "@/hooks/useDebug";
import useSidePanel from "@/hooks/useSidePanel";
import useUsers from "@/hooks/useUsers";
import { useParams } from "react-router-dom";

interface FormProps {
  name: string;
  username: string;
  password: string;
  confirmPassword: string;
  requirePasswordReset: boolean;
  location: string;
  homePhoneNumber: string;
  workPhoneNumber: string;
  primaryGroupValue: string;
}

const NewUserForm: FC = () => {
  const { instanceId: urlInstanceId } = useParams();
  const debug = useDebug();
  const { closeSidePanel } = useSidePanel();
  const { createUserQuery, getGroupsQuery } = useUsers();

  const instanceId = Number(urlInstanceId);

  const { mutateAsync } = createUserQuery;
  const { data, isLoading: isLoadingGroups } = getGroupsQuery({
    computer_id: instanceId,
  });

  const groupsData = data?.data.groups ?? [];

  const groupOptions = groupsData.map((group) => ({
    label: group.name,
    value: group.name,
  }));

  const formik = useFormik<FormProps>({
    initialValues: {
      name: "",
      username: "",
      password: "",
      confirmPassword: "",
      requirePasswordReset: false,
      location: "",
      homePhoneNumber: "",
      workPhoneNumber: "",
      primaryGroupValue: "",
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required("This field is required"),
      username: Yup.string().required("This field is required"),
      password: Yup.string().required("This field is required"),
      confirmPassword: Yup.string()
        .required("This field is required")
        .oneOf([Yup.ref("password"), ""], "Passwords must match"),
      location: Yup.string(),
      homePhoneNumber: Yup.string(),
      workPhoneNumber: Yup.string(),
      primaryGroupValue: Yup.string().required("This field is required"),
    }),
    onSubmit: async (values) => {
      try {
        await mutateAsync({
          computer_ids: [instanceId],
          name: values.name,
          username: values.username,
          password: values.password,
          require_password_reset: values.requirePasswordReset,
          location: values.location,
          home_phone: values.homePhoneNumber,
          work_phone: values.workPhoneNumber,
          primary_groupname: values.primaryGroupValue,
        });
        closeSidePanel();
      } catch (error) {
        debug(error);
      }
    },
  });

  return (
    <Form noValidate onSubmit={formik.handleSubmit} name="add-new-user">
      <Input
        type="text"
        label="Username"
        autoComplete="new-username"
        required
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
        required
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
        required
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
        required
        error={
          formik.touched.confirmPassword && formik.errors.confirmPassword
            ? formik.errors.confirmPassword
            : undefined
        }
        {...formik.getFieldProps("confirmPassword")}
      />
      <Input
        type="checkbox"
        label="Require passphrase reset"
        help="User must change password at first login"
        {...formik.getFieldProps("requirePasswordReset")}
        checked={formik.values.requirePasswordReset}
      />
      <Select
        label="Primary Group"
        disabled={isLoadingGroups}
        options={[{ label: "Select", value: "" }, ...groupOptions]}
        {...formik.getFieldProps("primaryGroupValue")}
        error={
          formik.touched.primaryGroupValue && formik.errors.primaryGroupValue
            ? formik.errors.primaryGroupValue
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
        submitButtonDisabled={formik.isSubmitting}
        submitButtonText="Add user"
      />
    </Form>
  );
};

export default NewUserForm;
