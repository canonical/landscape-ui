import { PocketLastSyncProps } from "@/types/Pocket";
import { ACTIVITY_STATUSES } from "@/features/activities";

export const getLastSyncStatusIcon = (
  status: PocketLastSyncProps["last_sync_status"],
) => {
  if (!status || status === "synced" || status === "in progress") {
    return "";
  }

  const key = status === "queued" ? "undelivered" : status;

  return ACTIVITY_STATUSES[key].icon;
};
