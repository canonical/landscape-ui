import { ACTIVITY_STATUSES } from "@/features/activities";
import type { PocketLastSyncProps } from "../../types";

export const getLastSyncStatusIcon = (
  status: PocketLastSyncProps["last_sync_status"],
): string => {
  if (!status || status === "synced" || status === "in progress") {
    return "";
  }

  const key = status === "queued" ? "undelivered" : status;

  return ACTIVITY_STATUSES[key].icon;
};
