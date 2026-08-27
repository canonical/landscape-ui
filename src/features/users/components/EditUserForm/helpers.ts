import type { Group, User } from "@/types/User";
import type { EditUserParams } from "../../api/useEditUser";
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

export const buildEditUserPayload = (
  computerId: number,
  values: EditUserFormValues,
  initialValues: EditUserFormValues,
  primaryGroupName?: string,
): EditUserParams => {
  const payload: EditUserParams = {
    computer_ids: [computerId],
    username: values.username,
  };

  if (
    primaryGroupName &&
    values.primaryGroupValue !== initialValues.primaryGroupValue
  ) {
    payload.primary_groupname = primaryGroupName;
  }
  if (values.name !== initialValues.name) {
    payload.name = values.name;
  }
  if (values.password) {
    payload.password = values.password;
  }
  if (values.location !== initialValues.location) {
    payload.location = values.location;
  }
  if (values.homePhoneNumber !== initialValues.homePhoneNumber) {
    payload.home_phone = values.homePhoneNumber;
  }
  if (values.workPhoneNumber !== initialValues.workPhoneNumber) {
    payload.work_phone = values.workPhoneNumber;
  }

  return payload;
};

export const hasEditUserChanges = (payload: EditUserParams): boolean =>
  Object.keys(payload).some(
    (key) => key !== "computer_ids" && key !== "username",
  );
