import type { Activity, ActivityStatus } from "@/features/activities";

export interface RecoveryKey {
  activity: Activity | null;
  fde_recovery_key: string | null;
}

export type RecoveryKeyActivityStatus =
  | Exclude<ActivityStatus, "succeeded">
  | undefined;
