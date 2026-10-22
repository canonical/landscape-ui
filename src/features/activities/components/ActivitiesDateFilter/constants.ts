import * as Yup from "yup";
import type { FormProps } from "./types";

export const INITIAL_VALUES: FormProps = {
  fromDate: "",
  toDate: "",
};

const DATE_SCHEMA = Yup.date()
  .transform((value: Date, originalValue: string) =>
    originalValue === "" ? undefined : value,
  )
  .typeError("Invalid date format");

export const VALIDATION_SCHEMA = Yup.object().shape({
  fromDate: DATE_SCHEMA,
  toDate: DATE_SCHEMA.when("fromDate", ([from], schema) =>
    from ? schema.min(from, "To date must be after From date") : schema,
  ),
});
