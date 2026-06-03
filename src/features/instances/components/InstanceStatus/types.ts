export type StatusSeverity =
  | "danger"
  | "warning"
  | "info"
  | "positive"
  | "neutral";

export interface StatusItem {
  key: string;
  label: string;
  icon: string;
  severity: StatusSeverity;
}
