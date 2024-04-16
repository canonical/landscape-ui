import * as Yup from "yup";
import { FormProps } from "./types";

export const INITIAL_VALUES: FormProps = {
  access_group: "",
  comment: "",
  tags: [],
  title: "",
};

export const VALIDATION_SCHEMA = Yup.object().shape({
  access_group: Yup.string(),
  comment: Yup.string(),
  tags: Yup.array().of(Yup.string()),
  title: Yup.string(),
});
