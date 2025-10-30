import * as Yup from "yup";
import type { FormProps } from "./types";

export const INITIAL_VALUES: FormProps = {
  fromDate: "",
  toDate: "",
};

export const VALIDATION_SCHEMA = Yup.object().shape({
  fromDate: Yup.date().typeError("Invalid date format"),
  toDate: Yup.date()
    .typeError("Invalid date format")
    .when("fromDate", ([from], schema) =>
      from ? schema.min(from, "To date must be after From date") : schema,
    ),
});
