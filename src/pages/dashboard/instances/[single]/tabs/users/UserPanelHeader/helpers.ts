import { User } from "@/types/User";

export const getSelectedUsers = (users: User[], selected: number[]): User[] => {
  return users.filter((user) => selected.includes(user.uid));
};
