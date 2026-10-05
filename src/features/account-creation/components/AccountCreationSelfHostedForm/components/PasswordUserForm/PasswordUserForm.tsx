import {
  ActionButton,
  Form,
  Input,
  PasswordToggle,
} from "@canonical/react-components";
import { useFormik } from "formik";
import type { FC } from "react";
import * as Yup from "yup";
import PasswordConstraints, {
  passwordValidationSchema,
} from "@/components/form/PasswordConstraints";
import { getFormikError } from "@/utils/formikErrors";
import type { PasswordUserFormValues } from "./types";

interface PasswordUserFormProps {
  readonly onSubmit: (values: PasswordUserFormValues) => Promise<void> | void;
  readonly submitButtonText?: string;
  readonly submitButtonClassName?: string;
  readonly submitting?: boolean;
}

const validationSchema = Yup.object().shape({
  ...passwordValidationSchema,
  name: Yup.string().trim().required("This field is required"),
  email: Yup.string()
    .required("This field is required")
    .email("Invalid email address"),
});

const PasswordUserForm: FC<PasswordUserFormProps> = ({
  onSubmit,
  submitButtonText = "Create account",
  submitButtonClassName,
  submitting = false,
}) => {
  const formik = useFormik<PasswordUserFormValues>({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      await onSubmit({ ...values, name: values.name.trim() });
    },
  });

  return (
    <Form onSubmit={formik.handleSubmit} noValidate>
      <Input
        type="text"
        label="Full name"
        required
        autoComplete="name"
        {...formik.getFieldProps("name")}
        error={getFormikError(formik, "name")}
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
        error={getFormikError(formik, "password")}
      />
      <PasswordConstraints
        password={formik.values.password}
        touched={!!formik.touched.password}
        hasError={!!formik.errors.password}
      />
      <ActionButton
        className={submitButtonClassName}
        appearance="positive"
        type="submit"
        loading={submitting || formik.isSubmitting}
        disabled={
          submitting || formik.isSubmitting || !formik.isValid || !formik.dirty
        }
      >
        {submitButtonText}
      </ActionButton>
    </Form>
  );
};

export default PasswordUserForm;
