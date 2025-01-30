import type { AccessGroupChangeFormValues } from "./types";
import * as Yup from "yup";

export const INITIAL_VALUES: AccessGroupChangeFormValues = {
  access_group: "",
};

export const VALIDATION_SCHEMA = Yup.object({
  access_group: Yup.string().required("This field is required"),
});
