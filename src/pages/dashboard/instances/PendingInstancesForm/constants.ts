import { PendingInstancesFormProps } from "./types";
import * as Yup from "yup";

export const INITIAL_VALUES: PendingInstancesFormProps = {
  access_group: "",
  computer_ids: [],
};

export const VALIDATION_SCHEMA = Yup.object().shape({
  access_group: Yup.string(),
  computer_ids: Yup.array().of(Yup.number()).min(1, "This field is required"),
});
