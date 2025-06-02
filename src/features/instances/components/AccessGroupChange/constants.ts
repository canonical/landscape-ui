import * as Yup from "yup";
import type { AccessGroupChangeFormValues } from "./types";

export const INITIAL_VALUES: AccessGroupChangeFormValues = {
  access_group: "global",
};

export const VALIDATION_SCHEMA = Yup.object({
  access_group: Yup.string().required("This field is required"),
});
