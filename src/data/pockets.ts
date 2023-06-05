import { SelectOption } from "../types/SelectOption";

export const PRE_DEFINED_POCKET_MODE_OPTIONS: SelectOption[] = [
  {
    label: "Mirror",
    value: "mirror",
  },
  {
    label: "Pull",
    value: "pull",
  },
  {
    label: "Upload",
    value: "upload",
  },
];

export const filterTypeOptions: SelectOption[] = [
  { label: "Select filter type", value: "" },
  { label: "Allow list", value: "whitelist" },
  { label: "Disallow list", value: "blacklist" },
];
