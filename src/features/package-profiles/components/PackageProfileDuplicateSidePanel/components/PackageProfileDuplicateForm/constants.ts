import * as Yup from "yup";

export const VALIDATION_SCHEMA = Yup.object().shape({
  access_group: Yup.string(),
  all_computers: Yup.boolean(),
  description: Yup.string().required("This field is required."),
  tags: Yup.array().of(Yup.string()),
  title: Yup.string(),
});
