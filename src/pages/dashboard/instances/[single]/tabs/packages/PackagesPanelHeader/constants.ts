import { SelectOption } from "@/types/SelectOption";

export const filterOptions: SelectOption[] = [
  {
    label: "All",
    value: "",
  },
  {
    label: "Installed",
    value: "installed",
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
];
