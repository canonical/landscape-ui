import {
  Cell,
  TableCellProps,
} from "@canonical/react-components/node_modules/@types/react-table";
import { HTMLProps } from "react";
import { APTSource } from "../../types";

export const handleCellProps = (cell: Cell<APTSource>) => {
  const cellProps: Partial<TableCellProps & HTMLProps<HTMLTableCellElement>> =
    {};
  switch (cell.column.id) {
    case "name":
      cellProps.role = "rowheader";
      break;
    case "access_group":
      cellProps["aria-label"] = "Access group";
      break;
    case "line":
      cellProps["aria-label"] = "Line";
      break;
    case "id":
      cellProps["aria-label"] = "Actions";
      break;
  }
  return cellProps;
};
