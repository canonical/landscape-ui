import { SelectOption } from "@/types/SelectOption";
import { PackageProfileConstraintType } from "@/features/package-profiles/types";

export const CONSTRAINT_TYPE_OPTIONS: (SelectOption & {
  value: PackageProfileConstraintType | "";
})[] = [
  { label: "All", value: "" },
  { label: "Conflicts", value: "conflicts" },
  { label: "Depends", value: "depends" },
];
