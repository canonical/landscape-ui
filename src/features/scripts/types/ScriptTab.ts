export type ScriptTabId = "info" | "code" | "version-history";

export interface ScriptTab {
  id: ScriptTabId;
  label: string;
}
