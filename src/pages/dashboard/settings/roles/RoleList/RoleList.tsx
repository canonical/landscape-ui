import { LIST_ACTIONS_COLUMN_PROPS } from "@/components/layout/ListActions";
import ResponsiveTable from "@/components/layout/ResponsiveTable";
import TruncatedCell from "@/components/layout/TruncatedCell";
import { useExpandableRow } from "@/hooks/useExpandableRow";
import useRoles from "@/hooks/useRoles";
import { getPermissionOptions } from "@/pages/dashboard/settings/roles/helpers";
import type { Role } from "@/types/Role";
import type { FC } from "react";
import { useMemo } from "react";
import type { CellProps, Column } from "react-table";
import RoleListActions from "../RoleListActions";
import {
  getPermissionListByType,
  handleCellProps,
  handleRowProps,
} from "./helpers";
import classes from "./RoleList.module.scss";
import type { CellCoordinates } from "./types";

interface RoleListProps {
  readonly roleList: Role[];
}

const RoleList: FC<RoleListProps> = ({ roleList }) => {
  const { expandedRowIndex, expandedColumnId, getTableRowsRef, handleExpand } =
    useExpandableRow<HTMLTableRowElement>();

  const { getPermissionsQuery } = useRoles();

  const { data: getPermissionsQueryResult } = getPermissionsQuery();

  const roles = useMemo<Role[]>(() => roleList, [roleList]);

  const columns = useMemo<Column<Role>[]>(() => {
    const permissionOptions = getPermissionsQueryResult
      ? getPermissionOptions(getPermissionsQueryResult.data)
      : [];

    return [
      {
        accessor: "name",
        Header: "Name",
      },
      {
        accessor: "persons",
        Header: "Administrators",
        className: classes.administrators,
        Cell: ({ row }: CellProps<Role>) => row.original.persons.length,
      },
      {
        accessor: "view",
        Header: "View",
        Cell: ({ row: { original, index } }: CellProps<Role>) => (
          <TruncatedCell
            content={getPermissionListByType(
              original,
              permissionOptions,
              "view",
            )}
            isExpanded={
              expandedRowIndex === index && expandedColumnId === "view"
            }
            onExpand={() => {
              handleExpand(index, "view");
            }}
          />
        ),
      },
      {
        accessor: "manage",
        Header: "Manage",
        Cell: ({ row: { original, index } }: CellProps<Role>) => (
          <TruncatedCell
            content={getPermissionListByType(
              original,
              permissionOptions,
              "manage",
            )}
            isExpanded={
              expandedRowIndex === index && expandedColumnId === "manage"
            }
            onExpand={() => {
              handleExpand(index, "manage");
            }}
          />
        ),
      },
      {
        ...LIST_ACTIONS_COLUMN_PROPS,
        Cell: ({ row }: CellProps<Role>) => {
          if (row.original.name === "GlobalAdmin") {
            return null;
          }

          return <RoleListActions role={row.original} />;
        },
      },
    ];
  }, [
    getPermissionsQueryResult,
    expandedRowIndex,
    expandedColumnId,
    handleExpand,
  ]);

  const expandedCell: CellCoordinates | null =
    expandedRowIndex !== null && expandedColumnId !== null
      ? { rowIndex: expandedRowIndex, columnId: expandedColumnId }
      : null;

  return (
    <ResponsiveTable
      ref={getTableRowsRef}
      columns={columns}
      data={roles}
      getCellProps={handleCellProps(expandedCell)}
      getRowProps={handleRowProps(expandedRowIndex ?? undefined)}
    />
  );
};

export default RoleList;
