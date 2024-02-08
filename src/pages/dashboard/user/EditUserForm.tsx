import { Form, Input, Select } from "@canonical/react-components";
import { useFormik } from "formik";
import { FC } from "react";
import * as Yup from "yup";
import SidePanelFormButtons from "../../../components/form/SidePanelFormButtons";
import useDebug from "../../../hooks/useDebug";
import { UserDetails } from "../../../types/UserDetails";
import { TIMEZONES } from "../../../constants";
import useUserDetails from "../../../hooks/useUserDetails";
import useSidePanel from "../../../hooks/useSidePanel";
import InfoItem from "../../../components/layout/InfoItem";
import useAuth from "../../../hooks/useAuth";

interface FormProps {
  name: string;
  timezone: string;
  email: string;
}

interface EditUserFormProps {
  user: UserDetails;
}

const EditUserForm: FC<EditUserFormProps> = ({ user }) => {
  const { user: authUser, updateUser } = useAuth();
  const debug = useDebug();
  const { closeSidePanel } = useSidePanel();
  const { editUserDetails } = useUserDetails();
  const { mutateAsync, isLoading } = editUserDetails;
  const emails = user.allowable_emails.map((email) => ({
    label: email,
    value: email,
  }));
  const currentEmail = emails.find((e) => e.label === user.email);
  const formik = useFormik<FormProps>({
    initialValues: {
      name: user.name,
      timezone: user.timezone,
      email: currentEmail?.label ?? "Select",
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required("This field is required"),
      timezone: Yup.string().required("This field is required"),
      email: Yup.string()
        .email("Please provide a valid email address")
        .required("This field is required"),
    }),
    onSubmit: async (values) => {
      try {
        await mutateAsync({
          name: values.name,
          email: values.email,
          timezone: values.timezone,
        });
        updateUser({
          ...authUser!,
          email: values.email,
          name: values.name,
        });
        closeSidePanel();
      } catch (error) {
        debug(error);
      }
    },
  });

  return (
    <Form noValidate onSubmit={formik.handleSubmit}>
      <Input
        label="Name"
        type="text"
        required
        error={
          formik.touched.name && formik.errors.name
            ? formik.errors.name
            : undefined
        }
        {...formik.getFieldProps("name")}
      />
      <Select
        label="Timezone"
        required
        options={TIMEZONES}
        {...formik.getFieldProps("timezone")}
        error={formik.touched.timezone && formik.errors.timezone}
      />
      {emails.length > 1 ? (
        <Select
          label="Email address"
          required
          options={emails}
          {...formik.getFieldProps("email")}
          error={formik.touched.email && formik.errors.email}
        />
      ) : (
        <InfoItem label="Email address" value={emails[0].value} />
      )}
      <SidePanelFormButtons
        disabled={isLoading}
        submitButtonText="Save changes"
        removeButtonMargin
      />
    </Form>
  );
};

export default EditUserForm;
