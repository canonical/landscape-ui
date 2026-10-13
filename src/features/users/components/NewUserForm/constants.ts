import type { NewUserFormValues } from "./types";
import * as Yup from "yup";

export const NEW_USER_INITIAL_VALUES: NewUserFormValues = {
  name: "",
  username: "",
  password: "",
  confirmPassword: "",
  requirePasswordReset: false,
  location: "",
  homePhoneNumber: "",
  workPhoneNumber: "",
  primaryGroupValue: "",
};

export const PRIMARY_GROUP_PLACEHOLDER_OPTION = { label: "Select", value: "" };

export const VALIDATION_SCHEMA = Yup.object().shape({
  name: Yup.string().required("This field is required"),
  username: Yup.string().required("This field is required"),
  password: Yup.string().required("This field is required"),
  confirmPassword: Yup.string()
    .required("This field is required")
    .oneOf([Yup.ref("password"), ""], "Passwords must match"),
  requirePasswordReset: Yup.boolean(),
  location: Yup.string(),
  homePhoneNumber: Yup.string(),
  workPhoneNumber: Yup.string(),
  primaryGroupValue: Yup.string().required("This field is required"),
});
