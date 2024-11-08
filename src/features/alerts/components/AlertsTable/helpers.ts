import {
  Cell,
  TableCellProps,
} from "@canonical/react-components/node_modules/@types/react-table";
import { HTMLProps } from "react";
import { Alert } from "../../types";

export const handleCellProps = (cell: Cell<Alert>) => {
  const cellProps: Partial<TableCellProps & HTMLProps<HTMLTableCellElement>> =
    {};
  switch (cell.column.id) {
    case "label":
      cellProps.role = "rowheader";
      break;
    case "subscribed":
      cellProps["aria-label"] = "Email";
      break;
    case "tags":
      cellProps["aria-label"] = "Tags";
      break;
    case "description":
      cellProps["aria-label"] = "Description";
      break;
  }

  return cellProps;
};
