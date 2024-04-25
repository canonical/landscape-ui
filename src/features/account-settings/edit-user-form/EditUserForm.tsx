import { Form, Input, Select } from "@canonical/react-components";
import { useFormik } from "formik";
import { FC } from "react";
import * as Yup from "yup";
import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import useDebug from "@/hooks/useDebug";
import { UserDetails } from "@/types/UserDetails";
import useUserDetails from "@/hooks/useUserDetails";
import useSidePanel from "@/hooks/useSidePanel";
import InfoItem from "@/components/layout/InfoItem";
import useAuth from "@/hooks/useAuth";
import { TIMEZONES_FILTER } from "./constants";
import useNotify from "@/hooks/useNotify";

interface FormProps {
  name: string;
  timezone: string;
  email: string;
  defaultOrganisation: string;
}

interface EditUserFormProps {
  user: UserDetails;
}

const EditUserForm: FC<EditUserFormProps> = ({ user }) => {
  const debug = useDebug();
  const { notify } = useNotify();

  const { user: authUser, updateUser } = useAuth();
  const { closeSidePanel } = useSidePanel();
  const { editUserDetails, setPreferredAccount } = useUserDetails();
  const { mutateAsync: editUserMutation, isLoading: isEditingUser } =
    editUserDetails;
  const {
    mutateAsync: mutateSetPreferredAccount,
    isLoading: isChangingPreferredAccount,
  } = setPreferredAccount;

  const emails = user.allowable_emails.map((email) => ({
    label: email,
    value: email,
  }));

  const ORGANISATIONS_OPTIONS = user.accounts.map((acc) => ({
    label: acc.title,
    value: acc.name,
  }));

  const currentEmail = emails.find((e) => e.label === user.email);
  const formik = useFormik<FormProps>({
    initialValues: {
      name: user.name,
      timezone: user.timezone,
      email: currentEmail?.label ?? "Select",
      defaultOrganisation:
        authUser?.accounts.find((acc) => acc.name === user.preferred_account)
          ?.name ?? "Select",
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
        await Promise.all([
          editUserMutation({
            name: values.name,
            email: values.email,
            timezone: values.timezone,
          }),
          mutateSetPreferredAccount({
            preferred_account: values.defaultOrganisation,
          }),
        ]);
        updateUser({
          ...authUser!,
          email: values.email,
          name: values.name,
        });
        closeSidePanel();
        notify.success({
          message: "User details updated successfully",
        });
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
      {emails.length > 1 ? (
        <Select
          label="Email address"
          required
          options={emails}
          {...formik.getFieldProps("email")}
          error={
            formik.touched.email && formik.errors.email
              ? formik.errors.email
              : undefined
          }
        />
      ) : (
        <InfoItem label="Email address" value={emails[0].value} />
      )}
      {TIMEZONES_FILTER.type === "select" && (
        <Select
          label={TIMEZONES_FILTER.label}
          required
          options={TIMEZONES_FILTER.options}
          {...formik.getFieldProps("timezone")}
          error={
            formik.touched.timezone && formik.errors.timezone
              ? formik.errors.timezone
              : undefined
          }
        />
      )}
      <Select
        label="Default organisation"
        required
        options={ORGANISATIONS_OPTIONS}
        {...formik.getFieldProps("defaultOrganisation")}
        error={
          formik.touched.timezone && formik.errors.timezone
            ? formik.errors.timezone
            : undefined
        }
      />
      <SidePanelFormButtons
        submitButtonDisabled={isEditingUser || isChangingPreferredAccount}
        submitButtonText="Save changes"
      />
    </Form>
  );
};

export default EditUserForm;
