import type { FC } from "react";
import { useMemo, useRef, useState } from "react";
import type { CellProps, Column } from "react-table";
import { useOnClickOutside } from "usehooks-ts";
import { ModularTable } from "@canonical/react-components";
import TruncatedCell from "@/components/layout/TruncatedCell";
import useRoles from "@/hooks/useRoles";
import RoleListActions from "@/pages/dashboard/settings/roles/RoleListActions";
import { getPermissionOptions } from "@/pages/dashboard/settings/roles/helpers";
import type { Role } from "@/types/Role";
import {
  getPermissionListByType,
  getTableRows,
  handleCellProps,
  handleRowProps,
} from "./helpers";
import type { CellCoordinates } from "./types";
import classes from "./RoleList.module.scss";

interface RoleListProps {
  readonly roleList: Role[];
}

const RoleList: FC<RoleListProps> = ({ roleList }) => {
  const [expandedCell, setExpandedCell] = useState<CellCoordinates | null>(
    null,
  );

  const { getPermissionsQuery } = useRoles();

  const tableRowsRef = useRef<HTMLTableRowElement[]>([]);

  useOnClickOutside(
    {
      current: expandedCell
        ? tableRowsRef.current[expandedCell.rowIndex]
        : null,
    },
    () => {
      setExpandedCell(null);
    },
  );

  const { data: getPermissionsQueryResult } = getPermissionsQuery();

  const permissionOptions = getPermissionsQueryResult
    ? getPermissionOptions(getPermissionsQueryResult.data)
    : [];

  const roles = useMemo<Role[]>(() => roleList, [roleList]);

  const columns = useMemo<Column<Role>[]>(
    () => [
      {
        accessor: "name",
        Header: "Name",
      },
      {
        accessor: "persons",
        Header: "Administrators",
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
              expandedCell?.rowIndex === index &&
              expandedCell.columnId === "view"
            }
            onExpand={() => {
              setExpandedCell({ rowIndex: index, columnId: "view" });
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
              expandedCell?.rowIndex === index &&
              expandedCell.columnId === "manage"
            }
            onExpand={() => {
              setExpandedCell({ rowIndex: index, columnId: "manage" });
            }}
          />
        ),
      },
      {
        accessor: "actions",
        className: classes.actions,
        Cell: ({ row: { original } }: CellProps<Role>) =>
          original.name !== "GlobalAdmin" ? (
            <RoleListActions role={original} />
          ) : null,
      },
    ],
    [roles, getPermissionsQueryResult, expandedCell],
  );

  return (
    <div ref={getTableRows(tableRowsRef)}>
      <ModularTable
        columns={columns}
        data={roles}
        getCellProps={handleCellProps(expandedCell)}
        getRowProps={handleRowProps(expandedCell?.rowIndex)}
      />
    </div>
  );
};

export default RoleList;
