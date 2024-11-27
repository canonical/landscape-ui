import {
  Cell,
  TableCellProps,
} from "@canonical/react-components/node_modules/@types/react-table";
import { HTMLProps } from "react";
import { InstalledSnap } from "../../types";

export const handleCellProps = (cell: Cell<InstalledSnap>) => {
  const cellProps: Partial<TableCellProps & HTMLProps<HTMLTableCellElement>> =
    {};
  switch (cell.column.id) {
    case "name":
      cellProps.role = "rowheader";
      break;
    case "channel":
      cellProps["aria-label"] = "Channel";
      break;
    case "held until":
      cellProps["aria-label"] = "Held until";
      break;
    case "version":
      cellProps["aria-label"] = "Version";
      break;
    case "summary":
      cellProps["aria-label"] = "Summary";
      break;
  }
  return cellProps;
};
