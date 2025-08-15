import type { Administrator } from "@/types/Administrator";
import type { HTMLProps } from "react";
import type { Cell, TableCellProps } from "react-table";

export const handleCellProps = (cell: Cell<Administrator>) => {
  const cellProps: Partial<TableCellProps & HTMLProps<HTMLTableCellElement>> =
    {};

  if (cell.column.id === "name") {
    cellProps.role = "rowheader";
  } else if (cell.column.id === "email") {
    cellProps["aria-label"] = "Email";
  } else if (cell.column.id === "roles") {
    cellProps["aria-label"] = "Roles";
  } else if (cell.column.id === "actions") {
    cellProps["aria-label"] = "Actions";
  }

  return cellProps;
};
