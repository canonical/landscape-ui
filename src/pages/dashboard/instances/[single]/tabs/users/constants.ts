import type { User } from "@/types/User";

export const SORT_KEYS = {
  username: "username",
  status: "status",
  name: "name",
  uid: "uid",
} as const;

type SortKey = keyof typeof SORT_KEYS;

export const SORT_FUNCTIONS: Record<SortKey, (a: User, b: User) => number> = {
  username: (a, b) => a.username.localeCompare(b.username),
  status: (a, b) => Number(a.enabled) - Number(b.enabled),
  name: (a, b) => (a.name || "").localeCompare(b.name || ""),
  uid: (a, b) => a.uid - b.uid,
};
