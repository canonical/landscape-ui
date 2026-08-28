import { useMemo, type FC } from "react";
import type { CellProps, Column, Cell, Row } from "react-table";
import type { HTMLProps } from "react";
import type { TableCellProps, TableRowProps } from "react-table";
import useRoles from "@/hooks/useRoles";
import useAdministrators from "@/hooks/useAdministrators";
import LoadingState from "@/components/layout/LoadingState";
import ResponsiveTable from "@/components/layout/ResponsiveTable";
import TruncatedCell from "@/components/layout/TruncatedCell";
import { useExpandableRow } from "@/hooks/useExpandableRow";
import classes from "./AccessGroupAdministratorsTable.module.scss";

interface AdminRoleRow extends Record<string, unknown> {
  administrator: string;
  roles: string[];
}

interface Props {
  readonly accessGroupName: string;
}

const AccessGroupAdministratorsTable: FC<Props> = ({ accessGroupName }) => {
  const { getRolesQuery } = useRoles();
  const { getAdministratorsQuery } = useAdministrators();
  const {
    data: rolesResponse,
    isLoading: isRolesLoading,
    isError: isRolesError,
  } = getRolesQuery();
  const { data: adminsResponse, isLoading: isAdminsLoading } =
    getAdministratorsQuery();
  const isLoading = isRolesLoading || isAdminsLoading;
  const { expandedRowIndex, expandedColumnId, getTableRowsRef, handleExpand } =
    useExpandableRow<HTMLTableRowElement>();

  const adminNameByEmail = useMemo(() => {
    const map = new Map<string, string>();
    for (const admin of adminsResponse?.data ?? []) {
      map.set(admin.email, admin.name);
    }
    return map;
  }, [adminsResponse?.data]);

  const rows = useMemo<AdminRoleRow[]>(() => {
    const roles = rolesResponse?.data ?? [];
    const matchingRoles = roles.filter((role) =>
      role.access_groups.includes(accessGroupName),
    );

    const adminRolesMap = new Map<string, string[]>();
    for (const role of matchingRoles) {
      for (const person of role.persons) {
        const existing = adminRolesMap.get(person) ?? [];
        existing.push(role.name);
        adminRolesMap.set(person, existing);
      }
    }

    return Array.from(adminRolesMap, ([email, roleNames]) => ({
      administrator: adminNameByEmail.get(email) ?? email,
      roles: roleNames,
    }));
  }, [rolesResponse?.data, accessGroupName, adminNameByEmail]);

  const columns = useMemo<Column<AdminRoleRow>[]>(
    () => [
      {
        accessor: "administrator",
        className: classes.administrator,
        Header: "Administrator",
      },
      {
        accessor: "roles",
        Header: "Role",
        Cell: ({ row: { original, index } }: CellProps<AdminRoleRow>) => (
          <TruncatedCell
            content={original.roles.map((role) => (
              <span key={role} className="truncatedItem">
                {role}
              </span>
            ))}
            isExpanded={
              expandedRowIndex === index && expandedColumnId === "roles"
            }
            onExpand={() => {
              handleExpand(index, "roles");
            }}
            showCount
          />
        ),
      },
    ],
    [expandedRowIndex, expandedColumnId, handleExpand],
  );

  if (isLoading) {
    return <LoadingState />;
  }

  const expandedCell =
    expandedRowIndex !== null && expandedColumnId !== null
      ? { rowIndex: expandedRowIndex, columnId: expandedColumnId }
      : null;

  const handleCellProps = ({ column, row: { index } }: Cell<AdminRoleRow>) => {
    const cellProps: Partial<TableCellProps & HTMLProps<HTMLTableCellElement>> =
      {};
    if (
      expandedCell &&
      expandedCell.rowIndex === index &&
      expandedCell.columnId === column.id
    ) {
      cellProps.className = "expandedCell";
    }
    return cellProps;
  };

  const handleRowProps = ({ index }: Row<AdminRoleRow>) => {
    const rowProps: Partial<TableRowProps & HTMLProps<HTMLTableRowElement>> =
      {};
    if (expandedRowIndex === index) {
      rowProps.className = "expandedRow";
    }
    return rowProps;
  };

  return (
    <ResponsiveTable
      ref={getTableRowsRef}
      columns={columns}
      data={rows}
      getCellProps={handleCellProps}
      getRowProps={handleRowProps}
      emptyMsg={
        isRolesError
          ? "Unable to retrieve associated roles."
          : "No administrators have roles associated with this access group."
      }
      minWidth={460}
    />
  );
};

export default AccessGroupAdministratorsTable;
