import * as Yup from "yup";
import { Constraint } from "../types";

export const INITIAL_VALUES: Constraint = {
  constraint: "",
  id: 0,
  notAnyVersion: false,
  package: "",
  rule: "",
  version: "",
};

export const VALIDATION_SCHEMA = Yup.object().shape({
  constraint: Yup.string().required("Required."),
  id: Yup.number(),
  notAnyVersion: Yup.boolean(),
  package: Yup.string().required("Required."),
  rule: Yup.string().when("notAnyVersion", {
    is: true,
    then: (schema) => schema.required("Required."),
  }),
  version: Yup.string().when("notAnyVersion", (values, schema) =>
    values[0] ? schema.required("Required.") : schema,
  ),
});
