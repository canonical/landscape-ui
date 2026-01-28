import type { AxiosResponse } from "axios";
import type { Role } from "@/types/Role";
import type {
  AccessGroupOption,
  PermissionOption,
} from "@/pages/dashboard/settings/roles/types";
import { getAccessGroupsToSubmit } from "@/pages/dashboard/settings/roles/helpers";
import type { FormProps, GetPromisesToEditRoleFn } from "./types";

export const addImpliedViewPermissions = (
  permissions: string[],
  permissionOptions: PermissionOption[],
): string[] => {
  const completePermissions = new Set(permissions);

  for (const option of permissionOptions) {
    if (option.values.manage && completePermissions.has(option.values.manage)) {
      completePermissions.add(option.values.view);
    }
  }

  return Array.from(completePermissions);
};

export const getValuesToEditRole = (
  values: FormProps,
  role: Role,
  accessGroupOptions: AccessGroupOption[],
  permissionOptions: PermissionOption[],
) => {
  const originalTotalPermissions = role.global_permissions
    ? [...role.permissions, ...role.global_permissions]
    : role.permissions;

  const originalPermissionsWithImpliedView = addImpliedViewPermissions(
    originalTotalPermissions,
    permissionOptions,
  );
  const formPermissionsWithImpliedView = addImpliedViewPermissions(
    values.permissions,
    permissionOptions,
  );

  const permissionsToAdd = formPermissionsWithImpliedView.filter(
    (permission) => !originalPermissionsWithImpliedView.includes(permission),
  );

  const permissionsToRemove = originalPermissionsWithImpliedView.filter(
    (permission) => !formPermissionsWithImpliedView.includes(permission),
  );

  if (permissionsToAdd.includes("AddComputerToAccessGroup")) {
    permissionsToAdd.push("RemoveComputerFromAccessGroup");
  }

  if (permissionsToRemove.includes("AddComputerToAccessGroup")) {
    permissionsToRemove.push("RemoveComputerFromAccessGroup");
  }

  const accessGroups = getAccessGroupsToSubmit(
    values.accessGroups,
    accessGroupOptions,
  );

  const accessGroupsToAdd = accessGroups.filter(
    (accessGroup) => !role.access_groups.includes(accessGroup),
  );

  const accessGroupsToRemove = role.access_groups.filter(
    (accessGroup) => !accessGroups.includes(accessGroup),
  );

  return {
    accessGroupsToAdd,
    accessGroupsToRemove,
    permissionsToAdd,
    permissionsToRemove,
  };
};

export const getPromisesToEditRole: GetPromisesToEditRoleFn = (
  values,
  role,
  accessGroupOptions,
  permissionOptions,
  handlers,
) => {
  const {
    addAccessGroups,
    addPermissions,
    removeAccessGroups,
    removePermissions,
  } = handlers;

  const promises: {
    [key in keyof typeof handlers as `${key}Promise`]?: Promise<
      AxiosResponse<Role>
    >;
  } = {};

  const {
    accessGroupsToAdd,
    accessGroupsToRemove,
    permissionsToAdd,
    permissionsToRemove,
  } = getValuesToEditRole(values, role, accessGroupOptions, permissionOptions);

  if (accessGroupsToAdd.length > 0) {
    promises.addAccessGroupsPromise = addAccessGroups({
      name: role.name,
      access_groups: accessGroupsToAdd,
    });
  }

  if (accessGroupsToRemove.length > 0) {
    promises.removeAccessGroupsPromise = removeAccessGroups({
      name: role.name,
      access_groups: accessGroupsToRemove,
    });
  }

  if (permissionsToRemove.length > 0) {
    promises.removePermissionsPromise = removePermissions({
      name: role.name,
      permissions: permissionsToRemove,
    });
  }

  if (permissionsToAdd.length > 0) {
    promises.addPermissionsPromise = addPermissions({
      name: role.name,
      permissions: permissionsToAdd,
    });
  }

  return promises;
};

export const getRoleFormProps = (
  role: Role,
  accessGroupOptions: AccessGroupOption[],
  permissionOptions: PermissionOption[],
): FormProps => {
  const accessGroups = [
    ...role.access_groups,
    ...role.access_groups.flatMap(
      (accessGroup) =>
        accessGroupOptions.find(({ value }) => value === accessGroup)
          ?.children || [],
    ),
  ];

  const initialPermissions = role.global_permissions
    ? [...role.permissions, ...role.global_permissions]
    : role.permissions;

  const completePermissions = addImpliedViewPermissions(
    initialPermissions,
    permissionOptions,
  );

  return { accessGroups, permissions: completePermissions };
};
