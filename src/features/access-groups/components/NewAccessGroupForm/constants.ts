import type { FormProps } from "./types";
import * as Yup from "yup";

export const INITIAL_VALUES: FormProps = {
  title: "",
  parent: "",
};

export const VALIDATION_SCHEMA = Yup.object().shape({
  title: Yup.string().required("This field is required"),
  parent: Yup.string().required("This field is required"),
});
