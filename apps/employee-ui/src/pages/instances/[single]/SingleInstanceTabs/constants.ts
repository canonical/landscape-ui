import type { Instance } from "@landscape/types";

export const TAB_LINKS: {
  label: string;
  id: string;
  condition: (instance: Instance) => boolean;
}[] = [
  {
    label: "Info",
    id: "tab-link-info",
    condition: () => true,
  },
  {
    label: "Hardware",
    id: "tab-link-hardware",
    condition: () => true,
  },
];
