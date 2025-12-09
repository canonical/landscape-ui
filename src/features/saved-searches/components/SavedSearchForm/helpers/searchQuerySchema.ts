import * as Yup from "yup";

export const VALIDATION_SCHEMA = Yup.object().shape({
  title: Yup.string().required("This field is required."),
});
