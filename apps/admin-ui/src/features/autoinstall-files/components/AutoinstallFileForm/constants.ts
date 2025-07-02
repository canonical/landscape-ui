import * as Yup from "yup";

export const VALIDATION_SCHEMA = Yup.object().shape({
  contents: Yup.string().required("This field is required"),
  filename: Yup.string().required("This field is required"),
});

export const DEFAULT_FILE = {
  contents: "",
  filename: "",
};
