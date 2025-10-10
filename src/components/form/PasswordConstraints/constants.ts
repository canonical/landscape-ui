import { MAX_PASSWORD_LENGTH } from "@/constants";
import * as Yup from "yup";

export const passwordValidationSchema = {
  password: Yup.string()
    .required("This field is required")
    .min(8, "Password must be at least 8 characters long")
    .max(
      MAX_PASSWORD_LENGTH,
      `Password must be at most ${MAX_PASSWORD_LENGTH} characters long`,
    )
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[0-9]/, "Password must contain at least one number"),
};
