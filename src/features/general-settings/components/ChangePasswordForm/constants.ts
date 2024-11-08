import * as Yup from "yup";

export const VALIDATION_SCHEMA = Yup.object().shape({
  currentPassword: Yup.string().required("This field is required"),
  newPassword: Yup.string()
    .required("This field is required")
    .min(8, "Password must be at least 8 characters long")
    .max(50, "Password must be at most 50 characters long")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[0-9]/, "Password must contain at least one number"),
});
