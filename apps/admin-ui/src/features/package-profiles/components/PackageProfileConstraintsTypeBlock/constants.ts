import type { SelectOption } from "@/types/SelectOption";

export const CONSTRAINTS_TYPE_OPTIONS: SelectOption[] = [
  { label: "Select constraints type", value: "" },
  { label: "From an instance's packages", value: "instance" },
  { label: "From a CSV file", value: "material" },
  { label: "Enter manually", value: "manual" },
];
