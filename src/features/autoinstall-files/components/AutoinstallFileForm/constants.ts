import * as Yup from "yup";

export const VALIDATION_SCHEMA = Yup.object().shape({
  addMethod: Yup.string().required("This field is required"),
  fileName: Yup.string().required("This field is required"),
});
