import { HOMEPAGE_PATH } from "@/constants";
import { getInvitationPath, useInvitation, useLogin } from "@/features/auth";
import useAuth from "@/hooks/useAuth";
import useDebug from "@/hooks/useDebug";
import {
  ActionButton,
  Form,
  Input,
  PasswordToggle,
} from "@canonical/react-components";
import { useFormik } from "formik";
import type { FC } from "react";
import { useSearchParams } from "react-router";
import * as Yup from "yup";
import classes from "./LoginForm.module.scss";
import { getFormikError } from "@/utils/formikErrors";
import { basicEmailSchema, normalizeEmail } from "@/utils/validation/email";

interface FormProps {
  identifier: string;
  password: string;
}

interface LoginFormProps {
  readonly isIdentityAvailable: boolean;
}

const LoginForm: FC<LoginFormProps> = ({ isIdentityAvailable }) => {
  const [searchParams] = useSearchParams();

  const debug = useDebug();
  const { login, isLoggingIn } = useLogin();
  const { invitationId } = useInvitation();

  const { safeRedirect, setUser } = useAuth();

  const redirectTo = searchParams.get("redirect-to");
  const isExternalRedirect = searchParams.has("external");

  const formik = useFormik<FormProps>({
    initialValues: {
      identifier: "",
      password: "",
    },
    validationSchema: Yup.object().shape({
      identifier: isIdentityAvailable
        ? Yup.string().required("This field is required")
        : basicEmailSchema().required("This field is required"),
      password: Yup.string().required("This field is required"),
    }),
    onSubmit: async (values) => {
      try {
        const { identifier, password } = values;
        const credentials = isIdentityAvailable
          ? { identity: identifier, password }
          : { email: normalizeEmail(identifier), password };
        const { data } = await login(credentials);

        if ("current_account" in data) {
          setUser(data);
        }

        if (invitationId) {
          safeRedirect(getInvitationPath(invitationId, searchParams), {
            replace: true,
          });
          return;
        }

        safeRedirect(redirectTo ?? HOMEPAGE_PATH, {
          external: isExternalRedirect,
          replace: true,
        });
      } catch (error) {
        debug(error);
      }
    },
  });

  return (
    <Form onSubmit={formik.handleSubmit}>
      <Input
        type="text"
        label={isIdentityAvailable ? "Identity" : "Email"}
        error={getFormikError(formik, "identifier")}
        {...formik.getFieldProps("identifier")}
        data-testid="identifier"
      />

      <PasswordToggle
        id="password"
        label="Password"
        error={getFormikError(formik, "password")}
        {...formik.getFieldProps("password")}
        data-testid="password"
      />

      <div className={classes.buttonRow}>
        <ActionButton
          type="submit"
          appearance="positive"
          loading={formik.isSubmitting || isLoggingIn}
          disabled={formik.isSubmitting || !formik.isValid || isLoggingIn}
          className="u-no-margin--bottom"
        >
          Sign in
        </ActionButton>
      </div>
    </Form>
  );
};

export default LoginForm;
