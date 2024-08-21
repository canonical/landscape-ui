import { FC, useState } from "react";
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
import axios, { AxiosResponse } from "axios";
import { API_URL, ROOT_PATH } from "@/constants";
import useAuth from "@/hooks/useAuth";
import { AuthUser } from "@/context/auth";
import { useNavigate } from "react-router-dom";

export interface LoginRequestParams {
  email: string;
  password: string;
}

export interface LoginRequestResponse extends AuthUser {}

interface FormProps {
  email: string;
  password: string;
  remember: boolean;
}

const LoginForm: FC = () => {
  const debug = useDebug();
  const { setUser } = useAuth();
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();

  const formik = useFormik<FormProps>({
    initialValues: {
      email: "",
      password: "",
      remember: false,
    },
    validationSchema: Yup.object().shape({
      email: Yup.string()
        .email("Please provide a valid email address")
        .required("This field is required"),
      password: Yup.string().required("This field is required"),
      remember: Yup.boolean(),
    }),
    onSubmit: async (values) => {
      setLoading(true);

      try {
        const { data } = await axios.post<
          LoginRequestResponse,
          AxiosResponse<LoginRequestResponse>,
          LoginRequestParams
        >(`${API_URL}login`, {
          email: values.email,
          password: values.password,
        });

        setUser(data, values.remember);

        navigate(`${ROOT_PATH}`, { replace: true });
      } catch (error) {
        debug(error);
      }

      setLoading(false);
    },
  });

  return (
    <Form onSubmit={formik.handleSubmit}>
      <Input
        type="text"
        label="Email"
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

      <div className="form-buttons">
        <Button
          type="submit"
          appearance="positive"
          disabled={isLoading}
          className="u-no-margin--bottom"
        >
          Login
        </Button>
      </div>
    </Form>
  );
};

export default LoginForm;
