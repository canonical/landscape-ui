import * as Yup from "yup";
import { FormProps } from "./types";

export const INITIAL_VALUES: FormProps = {
  addMethod: "fromFile",
  fileName: "administrators.yaml",
};

export const VALIDATION_SCHEMA = Yup.object().shape({
  addMethod: Yup.string().required("This field is required"),
  fileName: Yup.string().required("This field is required"),
});

export const NOTIFICATION_MESSAGE =
  "Autoinstall file can now be assigned to Employee groups.";

export const SUBMIT_BUTTON_TEXT = "Add";
