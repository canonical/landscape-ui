import type { User } from "@/types/User";

export const getSelectedUsernames = (users: User[]): string[] => {
  return users.map((user) => user.username);
};

export const getUserLockStatusCounts = (
  users: User[],
): { locked: number; unlocked: number } => {
  return users.reduce(
    (counts, user) => {
      counts.locked += user.enabled === false ? 1 : 0;
      counts.unlocked += user.enabled === true ? 1 : 0;
      return counts;
    },
    { locked: 0, unlocked: 0 },
  );
};
