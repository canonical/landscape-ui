import * as Yup from "yup";
import type { EditFormProps } from "../../../../types";

export const INITIAL_VALUES: EditFormProps = {
  all_computers: false,
  description: "",
  tags: [],
  title: "",
};

export const VALIDATION_SCHEMA = Yup.object().shape({
  all_computers: Yup.boolean(),
  description: Yup.string(),
  tags: Yup.array().of(Yup.string()),
  title: Yup.string().required("This field is required"),
});
