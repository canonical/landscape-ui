import type { FC } from "react";
import classNames from "classnames";
import { useFormik } from "formik";
import { useNavigate } from "react-router";
import {
  ActionButton,
  Form,
  Input,
  PasswordToggle,
} from "@canonical/react-components";

import PasswordConstraints from "@/components/form/PasswordConstraints";
import AuthTemplate from "@/templates/auth/AuthTemplate";
import useAuth from "@/hooks/useAuth";
import useDebug from "@/hooks/useDebug";
import { HOMEPAGE_PATH } from "@/constants";
import { ROUTES } from "@/libs/routes";
import { getFormikError } from "@/utils/formikErrors";

import { useLogin } from "@/features/auth";
import { useCreateStandaloneAccount } from "../../api";

import { INITIAL_VALUES, VALIDATION_SCHEMA } from "./constants";
import type { FormValues } from "./types";
import classes from "./AccountCreationSelfHostedForm.module.scss";

const AccountCreationSelfHostedForm: FC = () => {
  const debug = useDebug();
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const { createStandaloneAccount, isCreatingStandaloneAccount } =
    useCreateStandaloneAccount();

  const { login: signIn } = useLogin();

  const handleSubmit = async (values: FormValues) => {
    try {
      await createStandaloneAccount({
        name: values.fullName,
        email: values.email,
        password: values.password,
      });

      const { data } = await signIn({
        email: values.email,
        password: values.password,
      });

      if ("current_account" in data) {
        setUser(data);
        navigate(HOMEPAGE_PATH, { replace: true });
      } else {
        navigate(ROUTES.auth.login(), { replace: true });
      }
    } catch (error) {
      debug(error);
    }
  };

  const formik = useFormik<FormValues>({
    initialValues: INITIAL_VALUES,
    validationSchema: VALIDATION_SCHEMA,
    onSubmit: handleSubmit,
  });

  return (
    <AuthTemplate title="Create a new Landscape account">
      <Form onSubmit={formik.handleSubmit} noValidate>
        <Input
          type="text"
          label="Full name"
          required
          autoComplete="name"
          {...formik.getFieldProps("fullName")}
          error={getFormikError(formik, "fullName")}
        />

        <Input
          type="email"
          label="Email address"
          required
          autoComplete="email"
          {...formik.getFieldProps("email")}
          error={getFormikError(formik, "email")}
        />

        <PasswordToggle
          id="password"
          label="Password"
          required
          autoComplete="new-password"
          {...formik.getFieldProps("password")}
        />

        <PasswordConstraints
          password={formik.values.password}
          touched={!!formik.touched.password}
          hasError={!!formik.errors.password}
        />

        <ActionButton
          className={classNames(classes.button, "u-no-margin--bottom")}
          appearance="positive"
          type="submit"
          loading={isCreatingStandaloneAccount}
          disabled={
            isCreatingStandaloneAccount || !formik.isValid || !formik.dirty
          }
        >
          Create account
        </ActionButton>
      </Form>
    </AuthTemplate>
  );
};

export default AccountCreationSelfHostedForm;
