import buttonClasses from "@/components/form/SidePanelFormButtons.module.scss";
import LoadingState from "@/components/layout/LoadingState";
import useAuth from "@/hooks/useAuth";
import useAuthAccounts from "@/hooks/useAuthAccounts";
import useDebug from "@/hooks/useDebug";
import useEnv from "@/hooks/useEnv";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import { getFormikError } from "@/utils/formikErrors";
import { Button, Form, Input, Link, Select } from "@canonical/react-components";
import { useFormik } from "formik";
import type { FC } from "react";
import { lazy, Suspense } from "react";
import { useUserGeneralSettings } from "../../hooks";
import type { UserDetails } from "../../types";
import { TIMEZONE_OPTIONS, VALIDATION_SCHEMA } from "./constants";
import classes from "./EditUserForm.module.scss";
import { getAccountOptions } from "./helpers";
import type { EditUserFormValues } from "./types";

const ChangePasswordForm = lazy(async () => import("../ChangePasswordForm"));

interface EditUserFormProps {
  readonly userDetails: UserDetails;
}

const EditUserForm: FC<EditUserFormProps> = ({ userDetails }) => {
  const debug = useDebug();
  const { notify } = useNotify();
  const { isSaas, isSelfHosted } = useEnv();
  const { setSidePanelContent } = useSidePanel();
  const { user, setUser } = useAuth();
  const { isOnSubdomain, options } = useAuthAccounts();
  const { editUserDetails } = useUserGeneralSettings();

  const { mutateAsync: editUserMutation } = editUserDetails;

  const EMAIL_OPTIONS =
    userDetails.allowable_emails?.map((email) => ({
      label: email,
      value: email,
    })) ?? [];

  const formik = useFormik<EditUserFormValues>({
    initialValues: {
      name: userDetails.name,
      timezone: userDetails.timezone,
      email: userDetails.email,
      preferred_account: userDetails.preferred_account ?? "",
    },
    validationSchema: VALIDATION_SCHEMA,
    onSubmit: async (values, { resetForm }) => {
      try {
        if (!user) {
          return;
        }

        await editUserMutation(values);

        setUser({
          ...user,
          email: values.email,
          name: values.name,
        });

        notify.success({
          message: "User details updated successfully",
        });

        resetForm({ values });
      } catch (error) {
        debug(error);
      }
    },
  });

  const handleChangePassword = () => {
    setSidePanelContent(
      "Change password",
      <Suspense fallback={<LoadingState />}>
        <ChangePasswordForm />
      </Suspense>,
    );
  };

  return (
    <Form noValidate onSubmit={formik.handleSubmit}>
      <Input
        label="Name"
        type="text"
        error={getFormikError(formik, "name")}
        help="Visible to others in the organization"
        {...formik.getFieldProps("name")}
      />
      {EMAIL_OPTIONS.length > 1 ? (
        <Select
          label="Email address"
          options={EMAIL_OPTIONS}
          help={
            <>
              This email address is used to receive notifications from
              Landscape.{" "}
              {isSaas && (
                <>
                  <br />
                  To change or add an email, go to{" "}
                  <Link
                    className={classes.link}
                    href="https://login.ubuntu.com/"
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                  >
                    Ubuntu One
                  </Link>
                </>
              )}
            </>
          }
          {...formik.getFieldProps("email")}
          error={getFormikError(formik, "email")}
        />
      ) : (
        <Input
          label="Email"
          type="text"
          disabled={isSaas}
          help={
            <>
              This email address is used to receive notifications from
              Landscape.{" "}
              {isSaas && (
                <>
                  <br />
                  To change or add an email, go to{" "}
                  <Link
                    className={classes.link}
                    href="https://login.ubuntu.com/"
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                  >
                    Ubuntu One
                  </Link>
                </>
              )}
            </>
          }
          {...formik.getFieldProps("email")}
          error={getFormikError(formik, "email")}
        />
      )}
      <div className={classes.passwordField}>
        <Input
          label="Current"
          type="password"
          defaultValue="****************"
          wrapperClassName={classes.passwordInputWrapper}
          disabled
          help={
            isSaas ? (
              <>
                To change your passphrase, go to{" "}
                <Link
                  className={classes.link}
                  href="https://login.ubuntu.com/"
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                >
                  Ubuntu One.
                </Link>
              </>
            ) : undefined
          }
        />
        {isSelfHosted && (
          <Button type="button" onClick={handleChangePassword}>
            Change password
          </Button>
        )}
      </div>
      <Select
        label="Timezone"
        options={TIMEZONE_OPTIONS}
        {...formik.getFieldProps("timezone")}
        error={getFormikError(formik, "timezone")}
      />
      {!isOnSubdomain && options.length > 1 && (
        <Select
          label="Default organization"
          options={getAccountOptions(options, formik.values.preferred_account)}
          {...formik.getFieldProps("preferred_account")}
          error={getFormikError(formik, "preferred_account")}
        />
      )}
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

export default EditUserForm;
