import buttonClasses from "@/components/form/SidePanelFormButtons.module.scss";
import LoadingState from "@/components/layout/LoadingState";
import useAuth from "@/hooks/useAuth";
import useDebug from "@/hooks/useDebug";
import useEnv from "@/hooks/useEnv";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import { Button, Form, Input, Link, Select } from "@canonical/react-components";
import { useFormik } from "formik";
import { FC, lazy, Suspense } from "react";
import { useUserGeneralSettings } from "../../hooks";
import { UserDetails } from "../../types";
import { TIMEZONE_OPTIONS, VALIDATION_SCHEMA } from "./constants";
import classes from "./EditUserForm.module.scss";

const ChangePasswordForm = lazy(() => import("../ChangePasswordForm"));

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
  const { isSaas, isSelfHosted } = useEnv();
  const { setSidePanelContent } = useSidePanel();
  const { user: authUser, setUser, account } = useAuth();
  const { editUserDetails } = useUserGeneralSettings();

  const { mutateAsync: editUserMutation } = editUserDetails;

  const EMAIL_OPTIONS =
    user.allowable_emails?.map((email) => ({
      label: email,
      value: email,
    })) ?? [];

  const currentEmail = EMAIL_OPTIONS.find((e) => e.label === user.email);

  const formik = useFormik<FormProps>({
    initialValues: {
      name: user.name,
      timezone: user.timezone,
      email: currentEmail?.label ?? "Select",
      defaultOrganisation: account.switchable ? account.current : "",
    },
    validationSchema: VALIDATION_SCHEMA,
    onSubmit: async (values) => {
      try {
        if (!authUser) {
          return;
        }

        await editUserMutation({
          name: values.name,
          email: values.email,
          timezone: values.timezone,
          preferred_account: values.defaultOrganisation,
        });

        setUser({
          ...authUser,
          email: values.email,
          name: values.name,
        });

        notify.success({
          message: "User details updated successfully",
        });

        formik.resetForm({
          values: {
            name: values.name,
            timezone: values.timezone,
            email: values.email,
            defaultOrganisation: values.defaultOrganisation,
          },
        });
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
        error={
          formik.touched.name && formik.errors.name
            ? formik.errors.name
            : undefined
        }
        help="Visible to others in the organisation"
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
          error={
            formik.touched.email && formik.errors.email
              ? formik.errors.email
              : undefined
          }
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
          error={
            formik.touched.email && formik.errors.email
              ? formik.errors.email
              : undefined
          }
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
                  Ubuntu One
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
        error={
          formik.touched.timezone && formik.errors.timezone
            ? formik.errors.timezone
            : undefined
        }
      />
      {account.switchable && (
        <Select
          label="Default organisation"
          options={account.options}
          {...formik.getFieldProps("defaultOrganisation")}
          error={
            formik.touched.timezone && formik.errors.timezone
              ? formik.errors.timezone
              : undefined
          }
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
