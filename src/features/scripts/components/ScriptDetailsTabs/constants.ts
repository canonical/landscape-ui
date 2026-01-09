import type { ScriptTab } from "../../types/ScriptTab";

export const SCRIPT_TABS = [
  {
    id: "info",
    label: "Info",
  },
  {
    id: "code",
    label: "Code",
  },
  {
    id: "version-history",
    label: "Version history",
  },
] as const satisfies ScriptTab[];
