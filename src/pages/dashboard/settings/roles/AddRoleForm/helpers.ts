import { FormProps, GetPromisesToAddRoleFn } from "./types";
import { AxiosResponse } from "axios";
import { Role } from "@/types/Role";
import { getAccessGroupsToSubmit } from "@/pages/dashboard/settings/roles/helpers";
import { AccessGroupOption } from "@/pages/dashboard/settings/roles/types";

export const getValuesToAddRole = (
  values: FormProps,
  accessGroupOptions: AccessGroupOption[],
) => {
  return {
    accessGroupsToAdd: getAccessGroupsToSubmit(
      values.access_groups,
      accessGroupOptions,
    ),
    permissionsToAdd: values.permissions.includes("AddComputerToAccessGroup")
      ? [...values.permissions, "RemoveComputerFromAccessGroup"]
      : values.permissions,
  };
};

export const getPromisesToAddRole: GetPromisesToAddRoleFn = (
  values,
  accessGroupOptions,
  handlers,
) => {
  const { addAccessGroups, addPermissions } = handlers;

  const promises: Promise<AxiosResponse<Role>>[] = [];

  const { accessGroupsToAdd, permissionsToAdd } = getValuesToAddRole(
    values,
    accessGroupOptions,
  );

  if (accessGroupsToAdd.length > 0) {
    promises.push(
      addAccessGroups({
        name: values.name,
        access_groups: accessGroupsToAdd,
      }),
    );
  }

  if (permissionsToAdd.length > 0) {
    promises.push(
      addPermissions({
        name: values.name,
        permissions: permissionsToAdd,
      }),
    );
  }

  return promises;
};
