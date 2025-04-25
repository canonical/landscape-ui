import type { SelectOption } from "@/types/SelectOption";

export const SECURITY_STATUSES: SelectOption[] = [
  {
    label: "All",
    value: "",
  },
  {
    label: "Active",
    value: "active",
  },
  {
    label: "Archived",
    value: "archived",
  },
];
