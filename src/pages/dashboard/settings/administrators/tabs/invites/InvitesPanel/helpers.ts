import type { Invitation } from "@/types/Invitation";
import type { HTMLProps } from "react";
import type { Cell, TableCellProps } from "react-table";

export const handleCellProps = (cell: Cell<Invitation>) => {
  const cellProps: Partial<TableCellProps & HTMLProps<HTMLTableCellElement>> =
    {};

  if (cell.column.id === "name") {
    cellProps.role = "rowheader";
  } else if (cell.column.id === "email") {
    cellProps["aria-label"] = "Email";
  } else if (cell.column.id === "creation_time") {
    cellProps["aria-label"] = "Invited";
  } else if (cell.column.id === "expiration_time") {
    cellProps["aria-label"] = "Expires";
  } else if (cell.column.id === "actions") {
    cellProps["aria-label"] = "Actions";
  }

  return cellProps;
};
