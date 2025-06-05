import type { HTMLProps, RefObject } from "react";
import type { Cell, Row, TableCellProps, TableRowProps } from "react-table";
import type { PermissionOption } from "@/pages/dashboard/settings/roles/types";
import type { Role } from "@/types/Role";
import type { CellCoordinates } from "./types";

export const getPermissionListByType = (
  role: Role,
  permissionOptions: PermissionOption[],
  type: "view" | "manage",
) => {
  const permissions = role.global_permissions
    ? [...role.permissions, ...role.global_permissions]
    : role.permissions;

  const permissionsOfType = [
    ...new Set(
      permissions
        .filter((permission) =>
          type === "manage"
            ? !/(view|remove)/i.test(permission)
            : !/(remove)/i.test(permission) &&
              !permissionOptions.find(
                ({ values }) => values.manage === permission && !values.view,
              ),
        )
        .map(
          (permission) =>
            permissionOptions.find(({ values }) =>
              type === "manage"
                ? values.manage === permission
                : values.view === permission || values.manage === permission,
            )?.label ?? "",
        ),
    ),
  ];

  if (permissionsOfType.length === 0) {
    return "";
  }

  return permissionsOfType.length !==
    permissionOptions.filter(({ values }) => !!values[type]).length
    ? permissionsOfType
        .map((permission, index) =>
          index > 0
            ? permission
            : permission.replace(/^\w/, (character) => character.toUpperCase()),
        )
        .join(", ")
    : "All properties";
};

export const handleCellProps =
  (expandedCell: CellCoordinates | null) =>
  ({ column, row: { index } }: Cell<Role>) => {
    const cellProps: Partial<TableCellProps & HTMLProps<HTMLTableCellElement>> =
      {};

    if (
      expandedCell?.rowIndex === index &&
      expandedCell.columnId === column.id
    ) {
      cellProps.className = "expandedCell";
    }

    if (column.id === "name") {
      cellProps.role = "rowheader";
    } else if (column.id === "persons") {
      cellProps["aria-label"] = "Administrators";
    } else if (column.id === "view") {
      cellProps["aria-label"] = "View permissions";
    } else if (column.id === "manage") {
      cellProps["aria-label"] = "Manage permissions";
    } else if (column.id === "actions") {
      cellProps["aria-label"] = "Actions";
    }

    return cellProps;
  };

export const handleRowProps =
  (rowIndex?: number) =>
  ({ index }: Row<Role>) => {
    const rowProps: Partial<TableRowProps & HTMLProps<HTMLTableRowElement>> =
      {};

    if (rowIndex === index) {
      rowProps.className = "expandedRow";
    }

    return rowProps;
  };

export const getTableRows =
  (ref: RefObject<HTMLTableRowElement[]>) =>
  (instance: HTMLDivElement | null) => {
    if (!instance) {
      return;
    }

    ref.current = [
      ...instance.querySelectorAll<HTMLTableRowElement>("tbody tr"),
    ];
  };
