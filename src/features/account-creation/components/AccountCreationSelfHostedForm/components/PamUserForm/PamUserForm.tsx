import {
  ActionButton,
  Form,
  Input,
  PasswordToggle,
} from "@canonical/react-components";
import { useFormik } from "formik";
import type { FC } from "react";
import * as Yup from "yup";
import FieldDescription from "@/components/form/FieldDescription";
import { getFormikError } from "@/utils/formikErrors";
import type { PamUserFormValues } from "./types";

interface PamUserFormProps {
  readonly onSubmit: (values: PamUserFormValues) => Promise<void> | void;
  readonly submitButtonText?: string;
  readonly submitting?: boolean;
}

const validationSchema = Yup.object().shape({
  name: Yup.string().trim().required("This field is required"),
  email: Yup.string()
    .required("This field is required")
    .email("Invalid email address"),
  identity: Yup.string()
    .trim()
    .required("This field is required")
    .matches(
      /^[^()*\\\0]*$/,
      "Identity cannot contain these characters: (, ), *, \\, or \\0 (NUL).",
    ),
  password: Yup.string().required("This field is required"),
});

const PamUserForm: FC<PamUserFormProps> = ({
  onSubmit,
  submitButtonText = "Create account",
  submitting = false,
}) => {
  const formik = useFormik<PamUserFormValues>({
    initialValues: {
      name: "",
      email: "",
      identity: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      await onSubmit(values);
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

      <Input
        type="text"
        label={
          <FieldDescription
            label="PAM identity"
            description="Use a PAM identity that already exists on the configured LDAP server."
          />
        }
        required
        autoComplete="username"
        {...formik.getFieldProps("identity")}
        error={getFormikError(formik, "identity")}
      />

      <PasswordToggle
        id="password"
        label={
          <FieldDescription
            label="PAM password"
            description="Use the password for this PAM identity. It is validated through PAM and is not stored in Landscape."
          />
        }
        required
        autoComplete="new-password"
        {...formik.getFieldProps("password")}
        error={getFormikError(formik, "password")}
      />

      <ActionButton
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

export default PamUserForm;
