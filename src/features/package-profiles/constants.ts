import type { SelectOption } from "@/types/SelectOption";
import type { Constraint } from "./types";
import * as Yup from "yup";

export const EMPTY_CONSTRAINT: Omit<Constraint, "id"> = {
  constraint: "",
  notAnyVersion: false,
  package: "",
  rule: "",
  version: "",
};

export const TOUCHED_CONSTRAINT: Record<keyof Constraint, true> =
  Object.fromEntries(Object.keys(EMPTY_CONSTRAINT).map((key) => [key, true]));

export const LOADING_CONSTRAINT: Constraint = {
  constraint: "",
  id: 0,
  package: "loading",
  rule: "",
  version: "",
  notAnyVersion: false,
};

export const CONSTRAINT_RULE_OPTIONS: SelectOption[] = [
  { label: "Any", value: "" },
  { label: "Newer or equal to", value: ">=" },
  { label: "Newer than", value: ">" },
  { label: "Equal to", value: "=" },
  { label: "Older than", value: "<" },
  { label: "Older or equal to", value: "<=" },
];

export const CONSTRAINT_OPTIONS: SelectOption[] = [
  { label: "Select", value: "" },
  { label: "Conflicts with", value: "conflicts" },
  { label: "Depends on", value: "depends" },
];

export const constraintsSchema = Yup.array()
  .of(
    Yup.object().shape({
      constraint: Yup.string().required("Required."),
      notAnyVersion: Yup.boolean(),
      package: Yup.string().required("Required."),
      rule: Yup.string().when("notAnyVersion", {
        is: true,
        then: (schema) => schema.required("Required."),
      }),
      version: Yup.string().when("notAnyVersion", {
        is: true,
        then: (schema) => schema.required("Required."),
      }),
    }),
  )
  .min(1, "Package profiles must have at least one package constraint.");
