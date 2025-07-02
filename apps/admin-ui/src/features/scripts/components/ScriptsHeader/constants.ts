import type { SelectOption } from "@/types/SelectOption";

export const STATUS_OPTIONS: SelectOption[] = [
  { value: "all", label: "All" },
  { value: "", label: "Active" },
  { value: "archived", label: "Archived" },
  { value: "redacted", label: "Redacted" },
];
