import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import { Form, Icon, Input, PasswordToggle } from "@canonical/react-components";
import classNames from "classnames";
import { useFormik } from "formik";
import { FC } from "react";
import { useUserGeneralSettings } from "../../hooks";
import classes from "./ChangePasswordForm.module.scss";
import { VALIDATION_SCHEMA } from "./constants";

interface FormProps {
  currentPassword: string;
  newPassword: string;
}

const ChangePasswordForm: FC = () => {
  const debug = useDebug();
  const { notify } = useNotify();
  const { closeSidePanel } = useSidePanel();
  const { changePassword } = useUserGeneralSettings();
  const { mutateAsync: changePasswordMutation } = changePassword;

  const formik = useFormik<FormProps>({
    initialValues: {
      currentPassword: "",
      newPassword: "",
    },
    validationSchema: VALIDATION_SCHEMA,
    onSubmit: async (values) => {
      try {
        await changePasswordMutation({
          password: values.currentPassword,
          new_password: values.newPassword,
        });
        closeSidePanel();
        notify.success({
          message: "Password changed successfully",
        });
      } catch (error) {
        debug(error);
      }
    },
  });

  const checkConstraints = () => [
    {
      label: "8-50 characters",
      passed:
        formik.values.newPassword.length >= 8 &&
        formik.values.newPassword.length <= 50,
    },
    {
      label: "Lower case letters (a-z)",
      passed: /[a-z]/.test(formik.values.newPassword),
    },
    {
      label: "Upper case letters (A-Z)",
      passed: /[A-Z]/.test(formik.values.newPassword),
    },
    { label: "Numbers (0-9)", passed: /[0-9]/.test(formik.values.newPassword) },
  ];

  const constraints = checkConstraints();

  return (
    <Form noValidate onSubmit={formik.handleSubmit}>
      <Input
        label="Current password"
        type="password"
        required
        autoComplete="current-password"
        error={
          formik.touched.currentPassword && formik.errors.currentPassword
            ? formik.errors.currentPassword
            : undefined
        }
        {...formik.getFieldProps("currentPassword")}
      />
      <PasswordToggle
        required
        id="new-password"
        label="New password"
        autoComplete="new-password"
        data-testid="new-password"
        error={
          formik.touched.newPassword &&
          formik.errors.newPassword &&
          formik.errors.newPassword === "This field is required"
            ? formik.errors.newPassword
            : undefined
        }
        {...formik.getFieldProps("newPassword")}
      />
      <>
        <span className={classNames("u-text--muted")}>
          Password must contain
        </span>
        {constraints.map((constraint) => (
          <span
            key={constraint.label}
            className={classNames(classes.passwordConstraint, {
              [classes.passed]: constraint.passed,
              [classes.default]:
                !constraint.passed && !formik.touched.newPassword,
              [classes.failed]:
                !constraint.passed &&
                formik.errors.newPassword &&
                formik.touched.newPassword,
            })}
          >
            <Icon
              name={
                constraint.passed
                  ? "success"
                  : formik.errors.newPassword && formik.touched.newPassword
                    ? "error"
                    : "information"
              }
            />
            {constraint.label}
          </span>
        ))}
      </>
      <SidePanelFormButtons
        submitButtonDisabled={formik.isSubmitting}
        submitButtonText="Save changes"
      />
    </Form>
  );
};

export default ChangePasswordForm;
