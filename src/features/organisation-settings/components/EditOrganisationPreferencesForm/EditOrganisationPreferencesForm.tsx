import useAuth from "@/hooks/useAuth";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import { Preferences } from "@/types/Preferences";
import { Button, Form, Input } from "@canonical/react-components";
import { useFormik } from "formik";
import { ChangeEvent, FC } from "react";
import classes from "./EditOrganisationPreferencesForm.module.scss";
import buttonClasses from "@/components/form/SidePanelFormButtons.module.scss";
import { useOrgSettings } from "../../hooks";
import { FORM_FIELDS, VALIDATION_SCHEMA } from "./constants";

interface FormProps {
  title: string;
  use_registration_key: boolean;
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
  const { changeOrganisationPreferences } = useOrgSettings();

  const { mutateAsync } = changeOrganisationPreferences;

  const initialValues: FormProps = {
    title: organisationPreferences.title,
    use_registration_key: Boolean(
      organisationPreferences.registration_password,
    ),
    registration_password: organisationPreferences.registration_password || "",
    auto_register_new_computers:
      organisationPreferences.auto_register_new_computers,
  };

  const formik = useFormik<FormProps>({
    initialValues: initialValues,
    validationSchema: VALIDATION_SCHEMA,
    onSubmit: async (values) => {
      try {
        await mutateAsync({
          title: values.title,
          registration_password: values.registration_password,
          auto_register_new_computers: values.auto_register_new_computers,
        });

        if (values.title !== organisationPreferences.title) {
          updateUser({
            ...user!,
            current_account: values.title,
            accounts: user!.accounts.map((account) =>
              account.title === organisationPreferences.title
                ? { ...account, title: values.title }
                : account,
            ),
          });
        }

        formik.resetForm({
          values: {
            auto_register_new_computers: values.auto_register_new_computers,
            registration_password: values.registration_password,
            title: values.title,
            use_registration_key: values.use_registration_key,
          },
        });

        notify.success({
          title: "Your changes have been saved",
          message: `Changes made to organisation settings for ${values.title} have been successfully saved.`,
        });
      } catch (error) {
        debug(error);
      }
    },
  });

  const handleUseRegistrationKeyChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    formik.getFieldProps("registration_password").onChange(event);

    formik.setFieldValue("registration_password", "");
    formik.setFieldTouched("registration_password", false);
    formik.setFieldError("registration_password", undefined);

    formik.setFieldValue("auto_register_new_computers", false);
  };

  return (
    <Form noValidate onSubmit={formik.handleSubmit}>
      <Input
        label={FORM_FIELDS.organisationName.label}
        type={FORM_FIELDS.organisationName.type}
        help="Visible to others in organisation"
        error={
          formik.touched.title && formik.errors.title
            ? formik.errors.title
            : undefined
        }
        {...formik.getFieldProps("title")}
      />

      <Input
        label={FORM_FIELDS.useRegistrationKey.label}
        type={FORM_FIELDS.useRegistrationKey.type}
        checked={formik.values.use_registration_key}
        {...formik.getFieldProps("use_registration_key")}
        onChange={handleUseRegistrationKeyChange}
      />

      {formik.values.use_registration_key && (
        <div className={classes.registrationContainer}>
          <Input
            aria-label={FORM_FIELDS.registrationKey.label}
            type={FORM_FIELDS.registrationKey.type}
            error={
              formik.touched.registration_password &&
              formik.errors.registration_password
                ? formik.errors.registration_password
                : undefined
            }
            {...formik.getFieldProps("registration_password")}
          />
          <Input
            label={FORM_FIELDS.autoRegisterNewComputers.label}
            type={FORM_FIELDS.autoRegisterNewComputers.type}
            checked={formik.values.auto_register_new_computers}
            help="This will automatically accept new instances that register to your organisation."
            {...formik.getFieldProps("auto_register_new_computers")}
          />
        </div>
      )}

      <p className="p-form-help-text">
        When this feature is enabled, new computers must be enrolled using the
        key that&apos;s defined in the field.
      </p>

      <div className={buttonClasses.buttons}>
        <Button
          className="u-no-margin--bottom"
          appearance="positive"
          type="submit"
          disabled={formik.isSubmitting || !formik.dirty}
        >
          Save changes
        </Button>
      </div>
    </Form>
  );
};

export default EditOrganisationPreferencesForm;
