import * as Yup from "yup";
import {
  passwordValidationSchema,
  REQUIRED_FIELD_MESSAGE,
} from "@/components/form/PasswordConstraints";

export const VALIDATION_SCHEMA = Yup.object().shape({
  currentPassword: Yup.string().required(REQUIRED_FIELD_MESSAGE),
  newPassword: passwordValidationSchema.password,
});
