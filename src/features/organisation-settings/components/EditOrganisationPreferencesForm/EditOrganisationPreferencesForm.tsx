import buttonClasses from "@/components/form/SidePanelFormButtons/SidePanelFormButtons.module.scss";
import useAuth from "@/hooks/useAuth";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import type { Preferences } from "@/types/Preferences";
import { getFormikError } from "@/utils/formikErrors";
import { Button, Form, Input } from "@canonical/react-components";
import { useFormik } from "formik";
import type { ChangeEvent, FC } from "react";
import { useOrgSettings } from "../../hooks";
import { VALIDATION_SCHEMA } from "./constants";
import classes from "./EditOrganisationPreferencesForm.module.scss";

interface FormProps {
  title: string;
  use_registration_key: boolean;
  registration_password: string;
  auto_register_new_computers: boolean;
}

interface EditOrganisationPreferencesFormProps {
  readonly organisationPreferences: Preferences;
}

const EditOrganisationPreferencesForm: FC<
  EditOrganisationPreferencesFormProps
> = ({ organisationPreferences }) => {
  const { setUser, user } = useAuth();
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
        if (!user) {
          return;
        }

        await mutateAsync({
          title: values.title,
          registration_password: values.registration_password,
          auto_register_new_computers: values.auto_register_new_computers,
        });

        if (values.title !== organisationPreferences.title) {
          setUser({
            ...user,
            current_account: values.title,
            accounts: user.accounts.map((account) =>
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
          message: `Changes made to organization settings for ${values.title} have been successfully saved.`,
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
        label="Organization's name"
        type="text"
        help="Visible to others in organization"
        error={getFormikError(formik, "title")}
        {...formik.getFieldProps("title")}
      />

      <Input
        label="Use registration key"
        type="checkbox"
        checked={formik.values.use_registration_key}
        {...formik.getFieldProps("use_registration_key")}
        onChange={handleUseRegistrationKeyChange}
      />

      {formik.values.use_registration_key && (
        <div className={classes.registrationContainer}>
          <Input
            labelClassName="u-off-screen"
            label="Registration key"
            aria-label="Registration key"
            type="text"
            error={getFormikError(formik, "registration_password")}
            {...formik.getFieldProps("registration_password")}
          />
          <Input
            label="Auto register new computers"
            type="checkbox"
            checked={formik.values.auto_register_new_computers}
            help="This will automatically accept new instances that register to your organization."
            {...formik.getFieldProps("auto_register_new_computers")}
          />
        </div>
      )}

      <p className="p-form-help-text">
        When this feature is enabled, new computers must be enrolled using the
        key that&apos;s defined in the field.
      </p>

      <div className={`${buttonClasses.buttons} ${classes.buttons}`}>
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
