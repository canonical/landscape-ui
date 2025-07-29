import * as Yup from "yup";
import type { FormikProps } from "./types";

export const VALIDATION_SCHEMA = Yup.object().shape({
  contents: Yup.string().required("This field is required"),
  filename: Yup.string().required("This field is required"),
  is_default: Yup.boolean(),
});

export const DEFAULT_FILE: FormikProps = {
  contents: "",
  filename: "",
  is_default: false,
};
