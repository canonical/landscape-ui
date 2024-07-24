import { HTMLProps } from "react";
import { Cell, TableCellProps } from "react-table";
import { Script } from "../../types";

export const getCellProps = ({ column, row: { original } }: Cell<Script>) => {
  const cellProps: Partial<TableCellProps & HTMLProps<HTMLTableCellElement>> =
    {};

  if (original.title === "loading") {
    if (column.id === "title") {
      cellProps.colSpan = 4;
    } else {
      cellProps.hidden = true;
      cellProps["aria-hidden"] = true;
    }
  } else if (column.id === "title") {
    cellProps.role = "rowheader";
  } else if (column.id === "access_group") {
    cellProps["aria-label"] = "Access group";
  } else if (column.id === "creator.name") {
    cellProps["aria-label"] = "Creator";
  } else if (column.id === "id") {
    cellProps["aria-label"] = "Actions";
  }

  return cellProps;
};
