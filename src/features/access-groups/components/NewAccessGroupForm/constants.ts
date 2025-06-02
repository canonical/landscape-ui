import * as Yup from "yup";
import type { FormProps } from "./types";

export const INITIAL_VALUES: FormProps = {
  title: "",
  parent: "global",
};

export const VALIDATION_SCHEMA = Yup.object().shape({
  title: Yup.string().required("This field is required"),
  parent: Yup.string().required("This field is required"),
});
