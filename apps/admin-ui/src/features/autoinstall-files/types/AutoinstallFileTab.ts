export type AutoinstallFileTabId = "info" | "version-history";

export interface AutoinstallFileTab {
  id: AutoinstallFileTabId;
  label: string;
}
