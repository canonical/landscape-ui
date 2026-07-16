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
  /**
   * The stable value used when the pill toggles a table filter (the status
   * filter slug for statuses, the tag itself for tags). Kept separate from the
   * presentational `label` so filtering survives any future label formatting or
   * translation. When absent, the pill is not interactive.
   */
  filterValue?: string;
}
