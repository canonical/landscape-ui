import { SCRIPT_STATUSES } from "../../../../constants";
import type { ScriptStatus } from "@/features/scripts";

export const statusOptions = [
  { value: "", label: "All" },
  ...Object.keys(SCRIPT_STATUSES).map((slug) => ({
    value: slug,
    label: SCRIPT_STATUSES[slug as ScriptStatus].label,
  })),
];
