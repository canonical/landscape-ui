export type PackageChangePlanState =
  "created" | "executing" | "completed" | "failed";

export type PackageChangePlanAction = "install" | "remove" | "hold" | "unhold";

export interface PackageChangePlan {
  id: number;
  state: PackageChangePlanState;
  action: PackageChangePlanAction;
  created_at: string;
  item_count: number;
}
