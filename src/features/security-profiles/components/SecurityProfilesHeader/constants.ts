import type { SelectOption } from "@/types/SelectOption";

export const SECURITY_STATUSES: SelectOption[] = [
  {
    label: "Active",
    value: "active",
  },
  {
    label: "Archived",
    value: "archived",
  },
  {
    label: "Over Limit",
    value: "over-limit",
  },
];
