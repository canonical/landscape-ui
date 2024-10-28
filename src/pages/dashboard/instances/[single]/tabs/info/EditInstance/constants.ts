import * as Yup from "yup";

export const VALIDATION_SCHEMA = Yup.object().shape({
  access_group: Yup.string(),
  comment: Yup.string(),
  title: Yup.string(),
});
