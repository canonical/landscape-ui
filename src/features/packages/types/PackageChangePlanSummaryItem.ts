export enum TargetState {
  TARGET_STATE_UNSPECIFIED = 0,
  APPLICABLE = 1,
  NOT_APPLICABLE = 2,
}

export interface StateCount {
  state: TargetState;
  count: number;
}

export interface PackageChangePlanSummaryItem {
  package_id: number;
  package_name: string;
  package_version: string;
  package_state_counts: StateCount[];
}
