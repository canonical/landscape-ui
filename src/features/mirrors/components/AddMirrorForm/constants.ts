import type { SelectOption } from "@/types/SelectOption";

export const SNAPSHOT_START_DATE = "2023-02-28";
export const SNAPSHOT_TIMESTAMP_FORMAT = "YYYYMMDD[T]HHmmss[Z]";

export const POCKET_OPTIONS: SelectOption[] = [
  {
    label: "Release",
    value: "release",
  },
  {
    label: "Security",
    value: "security",
  },
  {
    label: "Updates",
    value: "updates",
  },
  {
    label: "Proposed",
    value: "proposed",
  },
  {
    label: "Backports",
    value: "backports",
  },
];
