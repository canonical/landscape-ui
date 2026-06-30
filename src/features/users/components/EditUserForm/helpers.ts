import type { Group, User } from "@/types/User";
import type { EditUserFormValues } from "./types";

export const getEditUserInitialValues = (
  user: User,
  initialUserAdditionalGroups: string[],
): EditUserFormValues => ({
  name: user.name ?? "",
  username: user.username,
  password: "",
  confirmPassword: "",
  location: user.location ?? "",
  homePhoneNumber: user.home_phone ?? "",
  workPhoneNumber: user.work_phone ?? "",
  primaryGroupValue: String(user.primary_gid),
  additionalGroupValue: initialUserAdditionalGroups,
});

export const getGroupDifferences = (
  currentGroupValues: string[],
  initialGroupValues: string[],
) => ({
  groupsToBeAdded: currentGroupValues.filter(
    (group) => !initialGroupValues.includes(group),
  ),
  groupsToBeRemoved: initialGroupValues.filter(
    (group) => !currentGroupValues.includes(group),
  ),
});

export const getGroupNamesByGids = (
  groups: Group[],
  gids: string[],
): string[] => {
  return groups.filter((g) => gids.includes(String(g.gid))).map((g) => g.name);
};
