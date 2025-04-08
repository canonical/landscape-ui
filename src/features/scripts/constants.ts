import type { ScriptStatus } from "./types/ScriptStatus";

export const SCRIPT_STATUSES: Record<ScriptStatus, { label: string }> = {
  active: {
    label: "Active",
  },
  archived: {
    label: "Archived",
  },
  redacted: {
    label: "Redacted",
  },
  v1: {
    label: "V1",
  },
};
