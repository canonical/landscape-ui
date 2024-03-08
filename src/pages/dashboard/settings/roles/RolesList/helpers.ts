import { PermissionOption } from "@/pages/dashboard/settings/roles/types";
import { Role } from "@/types/Role";

export const getPermissionLabelsByType = (
  role: Role,
  permissionOptions: PermissionOption[],
  type: "view" | "manage",
) => {
  const permissions = role.global_permissions
    ? [...role.permissions, ...role.global_permissions]
    : role.permissions;

  const permissionsOfType = permissions.filter((permission) =>
    type === "view"
      ? /view/i.test(permission)
      : !/(view|remove)/i.test(permission),
  );

  if (permissionsOfType.length === 0) {
    return [];
  }

  if (
    permissionsOfType.length ===
    permissionOptions.filter(({ values }) => !!values[type]).length
  ) {
    return ["All properties"];
  }

  return permissionsOfType.map((permission, index) => {
    const label =
      permissionOptions.find(({ values }) => values[type] === permission)
        ?.label ?? "";

    return index > 0
      ? label
      : label.replace(/^\w/, (character) => character.toUpperCase());
  });
};
