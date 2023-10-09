import { FC, useEffect, useState } from "react";
import useDebug from "../../../hooks/useDebug";
import useNotify from "../../../hooks/useNotify";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Button,
  CheckboxInput,
  Form,
  Input,
  PasswordToggle,
} from "@canonical/react-components";
import AppNotification from "../../../components/layout/AppNotification";
import axios, { AxiosResponse } from "axios";
import { API_URL } from "../../../constants";
import useAuth from "../../../hooks/useAuth";

interface RequestParams {
  email: string;
  password: string;
  account: "onward";
}

interface RequestResponse {
  token: string;
  email: string;
}

interface FormProps {
  email: string;
  password: string;
  remember: boolean;
}

const LoginForm: FC = () => {
  const debug = useDebug();
  const notify = useNotify();
  const { setUser } = useAuth();
  const [isLoading, setLoading] = useState(false);

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
          RequestResponse,
          AxiosResponse<RequestResponse>,
          RequestParams
        >(`${API_URL}login`, {
          email: values.email,
          password: values.password,
          account: "onward",
        });

        setUser(
          {
            name: "Yurii Test",
            email: data.email,
            token: data.token,
          },
          values.remember,
        );
      } catch (error) {
        debug(error);
      }

      setLoading(false);
    },
  });

  useEffect(() => notify.clear, []);

  return (
    <Form onSubmit={formik.handleSubmit}>
      <Input
        type="text"
        label="Name"
        error={
          formik.touched.email && formik.errors.email
            ? formik.errors.email
            : undefined
        }
        {...formik.getFieldProps("email")}
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
      />

      <CheckboxInput
        label="Remember this device"
        {...formik.getFieldProps("remember")}
      />

      <AppNotification notify={notify} />

      <div className="form-buttons">
        <Button type="submit" appearance="positive" disabled={isLoading}>
          Login
        </Button>
      </div>
    </Form>
  );
};

export default LoginForm;
