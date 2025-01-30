import type { SelectOption } from "@/types/SelectOption";
import type { PackageProfileConstraintType } from "../../types";

export const CONSTRAINT_TYPE_OPTIONS: (SelectOption & {
  value: PackageProfileConstraintType | "";
})[] = [
  { label: "All", value: "" },
  { label: "Conflicts", value: "conflicts" },
  { label: "Depends", value: "depends" },
];
