import { passwordValidationSchema } from "@/components/form/PasswordConstraints";
import { emailSchema } from "@/utils/validation/email";
import * as Yup from "yup";
import type { FormValues } from "./types";

export const INITIAL_VALUES: FormValues = {
  fullName: "",
  email: "",
  password: "",
};

export const VALIDATION_SCHEMA = Yup.object().shape({
  ...passwordValidationSchema,
  fullName: Yup.string().required("This field is required"),
  email: emailSchema().required("This field is required"),
});
