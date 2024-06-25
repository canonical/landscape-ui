import { SelectOption } from "@/types/SelectOption";
import { Constraint } from "./types";

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
