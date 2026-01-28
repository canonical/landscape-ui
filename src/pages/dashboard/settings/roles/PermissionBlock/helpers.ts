import type { PermissionOption } from "../types";

export const isOptionDisabled = ({
  option,
  permissions,
}: {
  option: PermissionOption;
  permissions: string[];
}) => {
  return (
    option.values.view === "" || permissions.includes(option.values.manage)
  );
};
