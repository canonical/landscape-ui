import type { SelectOption } from "@/types/SelectOption";

export const STATUS_OPTIONS = [
  {
    label: "All",
    value: "",
  },
  {
    label: "Upgrades",
    value: "upgrade",
  },
  {
    label: "Security upgrades",
    value: "security",
  },
  {
    label: "Held",
    value: "held",
  },
] as const satisfies SelectOption[];
