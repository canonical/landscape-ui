import type { SelectOption } from "@/types/SelectOption";
import type { RebootProfileDay } from "./types";

export const NOTIFICATION_ACTIONS = {
  add: "added",
  edit: "updated",
  duplicate: "added",
};

export const CTA_LABELS = {
  add: "Add reboot profile",
  duplicate: "Add reboot profile",
  edit: "Save changes",
};

export const DAY_OPTIONS: (SelectOption & {
  value: RebootProfileDay;
  order: number;
})[] = [
  { label: "Sunday", order: 0, value: "su" },
  { label: "Monday", order: 1, value: "mo" },
  { label: "Tuesday", order: 2, value: "tu" },
  { label: "Wednesday", order: 3, value: "we" },
  { label: "Thursday", order: 4, value: "th" },
  { label: "Friday", order: 5, value: "fr" },
  { label: "Saturday", order: 6, value: "sa" },
];

export const EXPIRATION_TOOLTIP_MESSAGE = `If Landscape cannot reboot the
associated instances by this point,
the reboot will be canceled.`;
