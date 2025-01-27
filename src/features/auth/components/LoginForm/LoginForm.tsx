import { FC } from "react";
import useDebug from "@/hooks/useDebug";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Button,
  Form,
  Input,
  PasswordToggle,
} from "@canonical/react-components";
import { ROOT_PATH } from "@/constants";
import useAuth from "@/hooks/useAuth";
import { useNavigate, useSearchParams } from "react-router";
import classes from "./LoginForm.module.scss";
import { useUnsigned } from "../../hooks";

interface FormProps {
  email: string;
  password: string;
}

interface LoginFormProps {
  isIdentityAvailable: boolean;
}

const LoginForm: FC<LoginFormProps> = ({ isIdentityAvailable }) => {
  const [searchParams] = useSearchParams();

  const debug = useDebug();
  const { signInWithEmailAndPasswordQuery } = useUnsigned();
  const { setUser, redirectToExternalUrl } = useAuth();
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
            .email("Please provide a valid email address"),
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
            setUser(data);
          }

          const url = new URL(
            redirectTo ?? `${ROOT_PATH}overview`,
            location.origin,
          );

          navigate(url.toString().replace(url.origin, ""), { replace: true });
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
          disabled={formik.isSubmitting}
          className="u-no-margin--bottom"
        >
          Sign in
        </Button>
      </div>
    </Form>
  );
};

export default LoginForm;
