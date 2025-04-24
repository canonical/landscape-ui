import type { SelectOption } from "@/types/SelectOption";

export const SECURITY_STATUSES: SelectOption[] = [
  {
    label: "All",
    value: "all",
  },
  {
    label: "Active",
    value: "",
  },
  {
    label: "Archived",
    value: "archived",
  },
  {
    label: "Over limit",
    value: "over-limit",
  },
];
