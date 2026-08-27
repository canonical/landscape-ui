import type { PendingUserActivity } from "@/types/User";

export const MAX_USERS_LIMIT = 5000;

export const PENDING_USER_ACTIVITY_VERBS: Record<
  PendingUserActivity["operation"],
  string
> = {
  lock: "locked",
  unlock: "unlocked",
  delete: "deleted",
};

export const getPendingUserActivityMessage = (
  operation: PendingUserActivity["operation"],
) =>
  `This user has a pending activity to be ${PENDING_USER_ACTIVITY_VERBS[operation]}.`;
