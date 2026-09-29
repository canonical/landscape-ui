export type PackageChangePlanState =
  | "pending"
  | "generating"
  | "ready"
  | "executing"
  | "executed"
  | "failed"
  | "expired";

export type PackageChangePlanAction =
  "install" | "remove" | "hold" | "unhold" | "upgrade" | "change_version";

export interface PackageChangePlan {
  id: number;
  action: PackageChangePlanAction;
  state: PackageChangePlanState;
  created_at: string;
  expires_at: string | null;
  item_count: number | null;
  executed_at: string | null;
  activity_id: number | null;
}
