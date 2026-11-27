import useRequestPasswordReset from "../../api/useRequestPasswordReset";
import { ROUTES } from "@/libs/routes";
import AuthTemplate from "@/templates/auth";
import { getFormikError } from "@/utils/formikErrors";
import { basicEmailSchema, normalizeEmail } from "@/utils/validation/email";
import { ActionButton, Form, Input } from "@canonical/react-components";
import { useFormik } from "formik";
import { useState, type FC } from "react";
import { Link } from "react-router";
import * as Yup from "yup";

const PasswordResetRequest: FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const { requestPasswordReset, isRequestingPasswordReset, error } =
    useRequestPasswordReset();
  const formik = useFormik({
    initialValues: { email: "" },
    validationSchema: Yup.object({
      email: basicEmailSchema().required("This field is required"),
    }),
    onSubmit: async ({ email }, { resetForm }) => {
      try {
        await requestPasswordReset({ email: normalizeEmail(email) });
        resetForm();
        setSubmitted(true);
      } catch {
        // The mutation error is rendered below.
      }
    },
  });

  return (
    <AuthTemplate
      title={submitted ? "Password reset Confirmed" : "Forgot password?"}
    >
      {submitted ? (
        <p>
          If an account with a local password exists for that email address, you
          will receive password reset instructions.
        </p>
      ) : (
        <Form noValidate onSubmit={formik.handleSubmit}>
          <Input
            type="email"
            label="Email address"
            required
            autoComplete="email"
            error={getFormikError(formik, "email")}
            {...formik.getFieldProps("email")}
          />
          {error && (
            <p role="alert" className="u-text--negative">
              {error.response?.data?.message || error.message}
            </p>
          )}
          <ActionButton
            type="submit"
            appearance="positive"
            loading={isRequestingPasswordReset}
            disabled={formik.isSubmitting || isRequestingPasswordReset}
          >
            Submit
          </ActionButton>
        </Form>
      )}
      <Link to={ROUTES.auth.login()}>Back to Login</Link>
    </AuthTemplate>
  );
};

export default PasswordResetRequest;
