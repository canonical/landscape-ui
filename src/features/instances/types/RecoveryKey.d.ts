import type { Activity } from "@/features/activities";

export interface RecoveryKey {
  activity: Activity | null;
  fde_recovery_key: string | null;
}
