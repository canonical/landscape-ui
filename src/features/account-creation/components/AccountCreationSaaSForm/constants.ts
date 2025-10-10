import * as Yup from "yup";
import type { FormValues } from "./types";

export const VALIDATION_SCHEMA = Yup.object().shape({
  title: Yup.string().required("This field is required."),
});

export const INITIAL_VALUES: FormValues = {
  title: "",
};
