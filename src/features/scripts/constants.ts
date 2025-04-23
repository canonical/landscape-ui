import type { ScriptStatus } from "./types/ScriptStatus";

export const DEFAULT_SCRIPT = "#!/bin/bash";

export const SCRIPT_STATUSES: Record<ScriptStatus, { label: string }> = {
  ACTIVE: {
    label: "Active",
  },
  ARCHIVED: {
    label: "Archived",
  },
  REDACTED: {
    label: "Redacted",
  },
};
