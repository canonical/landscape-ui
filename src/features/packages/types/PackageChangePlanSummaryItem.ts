export type TargetState = "applicable" | "not_applicable";

export interface StateCount {
  state: TargetState;
  count: number;
}

export interface PackageChangePlanSummaryItem extends Record<string, unknown> {
  package_id: number;
  package_name: string;
  package_version: string;
  package_state_counts: StateCount[];
}
