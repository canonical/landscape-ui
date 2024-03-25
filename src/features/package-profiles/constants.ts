import { SelectOption } from "@/types/SelectOption";

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
