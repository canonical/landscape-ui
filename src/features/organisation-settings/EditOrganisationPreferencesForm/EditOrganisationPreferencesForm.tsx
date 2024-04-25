import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import useAuth from "@/hooks/useAuth";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import { useOrgSettings } from "@/hooks/useOrgSettings";
import useSidePanel from "@/hooks/useSidePanel";
import { Preferences } from "@/types/Preferences";
import { Form, Input } from "@canonical/react-components";
import { useFormik } from "formik";
import { FC } from "react";
import * as Yup from "yup";

interface FormProps {
  title: string;
  registration_password: string;
  auto_register_new_computers: boolean;
}

interface EditOrganisationPreferencesFormProps {
  organisationPreferences: Preferences;
}

const EditOrganisationPreferencesForm: FC<
  EditOrganisationPreferencesFormProps
> = ({ organisationPreferences }) => {
  const { updateUser, user } = useAuth();
  const debug = useDebug();
  const { notify } = useNotify();
  const { closeSidePanel } = useSidePanel();
  const { changeOrganisationPreferences } = useOrgSettings();
  const { mutateAsync, isLoading } = changeOrganisationPreferences;

  const formik = useFormik<FormProps>({
    initialValues: {
      title: organisationPreferences.title,
      registration_password: organisationPreferences.registration_password
        ? organisationPreferences.registration_password
        : "",
      auto_register_new_computers:
        organisationPreferences.auto_register_new_computers,
    },
    validationSchema: Yup.object().shape({
      title: Yup.string().required("This field is required"),
      use_registration_key: Yup.boolean(),
      registration_password: Yup.string()
        .notRequired()
        .test(
          "min",
          "Registration key must be at least 3 characters",
          (val) => !val || val.length >= 3,
        ),
      auto_register_new_computers: Yup.boolean(),
    }),
    onSubmit: async (values) => {
      try {
        mutateAsync({
          title: values.title,
          registration_password: values.registration_password
            ? values.registration_password
            : undefined,
          auto_register_new_computers: values.auto_register_new_computers,
        });
        updateUser({
          ...user!,
          current_account: values.title,
          accounts: user!.accounts.map((account) =>
            account.title === organisationPreferences.title
              ? { ...account, title: values.title }
              : account,
          ),
        });
        closeSidePanel();
        notify.success({
          message: "Organisation settings updated successfully",
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
          formik.touched.title && formik.errors.title
            ? formik.errors.title
            : undefined
        }
        {...formik.getFieldProps("title")}
      />
      <Input
        label="Registration key"
        type="text"
        error={
          formik.touched.registration_password &&
          formik.errors.registration_password
            ? formik.errors.registration_password
            : undefined
        }
        {...formik.getFieldProps("registration_password")}
      />
      <Input
        label="Auto register new computers"
        type="checkbox"
        checked={formik.values.auto_register_new_computers}
        help="This will automatically accept new instances that register to your organisation."
        {...formik.getFieldProps("auto_register_new_computers")}
      />
      <SidePanelFormButtons
        submitButtonDisabled={isLoading}
        submitButtonText="Save changes"
      />
    </Form>
  );
};

export default EditOrganisationPreferencesForm;
