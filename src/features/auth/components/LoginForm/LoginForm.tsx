import { FC } from "react";
import useDebug from "@/hooks/useDebug";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Button,
  CheckboxInput,
  Form,
  Input,
  PasswordToggle,
} from "@canonical/react-components";
import { ROOT_PATH } from "@/constants";
import useAuth from "@/hooks/useAuth";
import { useNavigate, useSearchParams } from "react-router-dom";
import classes from "./LoginForm.module.scss";
import { useAuthHandle } from "../../hooks";
import { redirectToExternalUrl } from "../../helpers";

interface FormProps {
  email: string;
  password: string;
  remember: boolean;
}

interface LoginFormProps {
  isEmailIdentityOnly: boolean;
}

const LoginForm: FC<LoginFormProps> = ({ isEmailIdentityOnly }) => {
  const [searchParams] = useSearchParams();

  const debug = useDebug();
  const { signInWithEmailAndPasswordQuery } = useAuthHandle();
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const redirectTo = searchParams.get("redirect-to");
  const isExternalRedirect = searchParams.has("external");

  const { mutateAsync: signInWithEmailAndPassword } =
    signInWithEmailAndPasswordQuery;

  const formik = useFormik<FormProps>({
    initialValues: {
      email: "",
      password: "",
      remember: false,
    },
    validationSchema: Yup.object().shape({
      email: isEmailIdentityOnly
        ? Yup.string()
            .required("This field is required")
            .email("Please provide a valid email address")
        : Yup.string().required("This field is required"),
      password: Yup.string().required("This field is required"),
      remember: Yup.boolean(),
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
          setUser(data, values.remember);

          const url = new URL(redirectTo ?? ROOT_PATH, location.origin);

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
        label={isEmailIdentityOnly ? "Email" : "Identity"}
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

      <CheckboxInput
        label="Remember this device"
        {...formik.getFieldProps("remember")}
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
