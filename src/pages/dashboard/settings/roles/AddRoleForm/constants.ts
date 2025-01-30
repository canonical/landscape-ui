import * as Yup from "yup";
import type { FormProps } from "./types";

export const INITIAL_VALUES: FormProps = {
  access_groups: [],
  description: "",
  name: "",
  permissions: [],
};

export const VALIDATION_SCHEMA = Yup.object().shape({
  access_groups: Yup.array().of(Yup.string()),
  description: Yup.string(),
  name: Yup.string()
    .required("This field is required.")
    .matches(
      /^[a-zA-Z][-+a-zA-Z0-9]*$/,
      "Name must start with a letter and can contain alphanumeric characters, ‘-‘ and ‘+’.",
    ),
  permissions: Yup.array().of(Yup.string()),
});
