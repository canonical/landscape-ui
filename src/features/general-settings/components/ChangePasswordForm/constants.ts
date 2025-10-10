import * as Yup from "yup";
import { passwordValidationSchema } from "@/components/form/PasswordConstraints";

export const VALIDATION_SCHEMA = Yup.object().shape({
  currentPassword: Yup.string().required("This field is required"),
  newPassword: passwordValidationSchema.password,
});
