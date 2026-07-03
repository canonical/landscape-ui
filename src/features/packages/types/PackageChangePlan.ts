export enum PackageChangePlanState {
  STATE_UNSPECIFIED = 0,
  CREATED = 1,
  EXECUTING = 2,
  COMPLETED = 3,
  FAILED = 4,
}

export enum PackageChangePlanAction {
  ACTION_UNSPECIFIED = 0,
  INSTALL = 1,
  REMOVE = 2,
  HOLD = 3,
  UNHOLD = 4,
}

export interface PackageChangePlan {
  id: number;
  state: PackageChangePlanState;
  action: PackageChangePlanAction;
  created_at: string;
  item_count: number;
}
