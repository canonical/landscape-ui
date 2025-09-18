import type { PermissionOption } from "../types";

export const isOptionDisabled = ({
  option,
  permissions,
  options,
}: {
  option: PermissionOption;
  permissions: string[];
  options: PermissionOption[];
}) => {
  return (
    option.values.view === "" ||
    permissions.includes(
      options.filter(({ label }) => label === option.label)[0]?.values.manage,
    )
  );
};
