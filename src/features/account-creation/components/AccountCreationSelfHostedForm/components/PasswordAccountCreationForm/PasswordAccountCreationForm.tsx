import {
  ActionButton,
  Form,
  Input,
  PasswordToggle,
} from "@canonical/react-components";
import classNames from "classnames";
import { useFormik } from "formik";
import type { FC } from "react";
import * as Yup from "yup";
import PasswordConstraints, {
  passwordValidationSchema,
} from "@/components/form/PasswordConstraints";
import AuthTemplate from "@/templates/auth/AuthTemplate";
import useDebug from "@/hooks/useDebug";
import { getFormikError } from "@/utils/formikErrors";
import AccountCreationAlternative from "../../../AccountCreationAlternative/AccountCreationAlternative";
import type { CreateStandaloneAccountParams } from "../../../../api";
import type { LoginRequestParams } from "@/features/auth";
import classes from "./PasswordAccountCreationForm.module.scss";

interface FormValues {
  fullName: string;
  email: string;
  password: string;
}

interface PasswordAccountCreationFormProps {
  readonly createStandaloneAccount: (
    params: CreateStandaloneAccountParams,
  ) => Promise<unknown>;
  readonly signInAfterCreation: (
    credentials: LoginRequestParams,
  ) => Promise<void>;
  readonly submitting: boolean;
  readonly oidcEnabled: boolean;
  readonly ubuntuOneEnabled: boolean;
}

const validationSchema = Yup.object().shape({
  ...passwordValidationSchema,
  fullName: Yup.string().trim().required("This field is required"),
  email: Yup.string()
    .required("This field is required")
    .email("Invalid email address"),
});

const PasswordAccountCreationForm: FC<PasswordAccountCreationFormProps> = ({
  createStandaloneAccount,
  signInAfterCreation,
  submitting,
  oidcEnabled,
  ubuntuOneEnabled,
}) => {
  const debug = useDebug();

  const handleSubmit = async (values: FormValues) => {
    try {
      await createStandaloneAccount({
        name: values.fullName.trim(),
        email: values.email,
        password: values.password,
      });

      await signInAfterCreation({
        email: values.email,
        password: values.password,
      });
    } catch (error) {
      debug(error);
    }
  };

  const formik = useFormik<FormValues>({
    initialValues: { fullName: "", email: "", password: "" },
    validationSchema,
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
          className={classNames(classes.button, "u-margin--bottom")}
          appearance="positive"
          type="submit"
          loading={submitting}
          disabled={submitting || !formik.isValid || !formik.dirty}
        >
          Create account
        </ActionButton>
      </Form>
      <AccountCreationAlternative
        oidcEnabled={oidcEnabled}
        ubuntuOneEnabled={ubuntuOneEnabled}
      />
    </AuthTemplate>
  );
};

export default PasswordAccountCreationForm;