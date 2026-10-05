import LoadingState from "@/components/layout/LoadingState";
import ResponsiveTable from "@/components/layout/ResponsiveTable";
import useRoles from "@/hooks/useRoles";
import { getPermissionOptions } from "@/pages/dashboard/settings/roles/helpers";
import { getPermissionListByType } from "@/pages/dashboard/settings/roles/RoleList/helpers";
import type { Role } from "@/types/Role";
import { getTitleByName } from "@/utils/_helpers";
import type { FC } from "react";
import { useMemo } from "react";
import type { CellProps, Column } from "react-table";

/** The entered account's roles with their permissions, read-only. */
const SupportRoles: FC = () => {
  const { getRolesQuery, getPermissionsQuery, getAccessGroupQuery } =
    useRoles();
  const { data: rolesData, isLoading: isGettingRoles } = getRolesQuery();
  const { data: permissionsData } = getPermissionsQuery();
  const { data: accessGroupsData } = getAccessGroupQuery();

  const columns = useMemo<Column<Role>[]>(() => {
    const permissionOptions = permissionsData
      ? getPermissionOptions(permissionsData.data)
      : [];

    return [
      { accessor: "name", Header: "Name" },
      {
        accessor: "persons",
        Header: "Administrators",
        Cell: ({ row: { original } }: CellProps<Role>) =>
          original.persons.length,
      },
      {
        accessor: "access_groups",
        Header: "Access groups",
        Cell: ({ row: { original } }: CellProps<Role>) =>
          original.access_groups
            .map((name) => getTitleByName(name, accessGroupsData))
            .join(", "),
      },
      {
        id: "view",
        Header: "View",
        Cell: ({ row: { original } }: CellProps<Role>) =>
          getPermissionListByType(original, permissionOptions, "view"),
      },
      {
        id: "manage",
        Header: "Manage",
        Cell: ({ row: { original } }: CellProps<Role>) =>
          getPermissionListByType(original, permissionOptions, "manage"),
      },
    ];
  }, [accessGroupsData, permissionsData]);

  if (isGettingRoles) {
    return <LoadingState />;
  }

  return (
    <ResponsiveTable
      columns={columns}
      data={rolesData?.data ?? []}
      emptyMsg="This account has no roles."
    />
  );
};

export default SupportRoles;
