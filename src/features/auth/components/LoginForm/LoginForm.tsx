import { HOMEPAGE_PATH } from "@/constants";
import useAuth from "@/hooks/useAuth";
import useDebug from "@/hooks/useDebug";
import {
  Button,
  Form,
  Input,
  PasswordToggle,
} from "@canonical/react-components";
import { useFormik } from "formik";
import type { FC } from "react";
import { useNavigate, useSearchParams } from "react-router";
import * as Yup from "yup";
import { useUnsigned } from "../../hooks";
import classes from "./LoginForm.module.scss";

interface FormProps {
  email: string;
  password: string;
}

interface LoginFormProps {
  readonly isIdentityAvailable: boolean;
}

const LoginForm: FC<LoginFormProps> = ({ isIdentityAvailable }) => {
  const [searchParams] = useSearchParams();

  const debug = useDebug();
  const { signInWithEmailAndPasswordQuery } = useUnsigned();
  const { redirectToExternalUrl, setAuthLoading, setUser } = useAuth();
  const navigate = useNavigate();

  const redirectTo = searchParams.get("redirect-to");
  const isExternalRedirect = searchParams.has("external");

  const { mutateAsync: signInWithEmailAndPassword } =
    signInWithEmailAndPasswordQuery;

  const formik = useFormik<FormProps>({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object().shape({
      email: isIdentityAvailable
        ? Yup.string().required("This field is required")
        : Yup.string()
            .required("This field is required")
            .matches(
              /^[a-zA-Z0-9-_.]+@[a-zA-Z0-9-.]*[a-zA-Z]$/,
              "Please provide a valid email address",
            )
            .test({
              message: "Please provide a valid email address",
              test: (value) => {
                if (value.match(/\.\./)) {
                  return false;
                }

                const [first, domain] = value.split("@");

                if (
                  !first ||
                  !domain ||
                  first.startsWith(".") ||
                  first.endsWith(".") ||
                  !domain.includes(".") ||
                  domain.startsWith(".") ||
                  domain.startsWith("-") ||
                  domain.match(/\.-/) ||
                  domain.match(/-\./)
                ) {
                  return false;
                }

                return true;
              },
            }),
      password: Yup.string().required("This field is required"),
    }),
    onSubmit: async (values) => {
      try {
        const { data } = await signInWithEmailAndPassword({
          email: values.email,
          password: values.password,
        });

        if (isExternalRedirect && redirectTo) {
          redirectToExternalUrl(redirectTo, { replace: true });
        } else {
          if ("current_account" in data) {
            setAuthLoading(true);
            setUser(data);
          }

          navigate(redirectTo ?? HOMEPAGE_PATH, { replace: true });
        }
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
        error={
          formik.touched.email && formik.errors.email
            ? formik.errors.email
            : undefined
        }
        {...formik.getFieldProps("email")}
        data-testid="email"
      />

      <PasswordToggle
        id="password"
        label="Password"
        error={
          formik.touched.password && formik.errors.password
            ? formik.errors.password
            : undefined
        }
        {...formik.getFieldProps("password")}
        data-testid="password"
      />

      <div className={classes.buttonRow}>
        <Button
          type="submit"
          appearance="positive"
          disabled={formik.isSubmitting || !formik.isValid}
          className="u-no-margin--bottom"
        >
          Sign in
        </Button>
      </div>
    </Form>
  );
};

export default LoginForm;
