import { GPGKey } from "../../types";
import {
  Cell,
  TableCellProps,
} from "@canonical/react-components/node_modules/@types/react-table";
import { HTMLProps } from "react";

export const handleCellProps = (cell: Cell<GPGKey>) => {
  const cellProps: Partial<TableCellProps & HTMLProps<HTMLTableCellElement>> =
    {};
  switch (cell.column.id) {
    case "name":
      cellProps.role = "rowheader";
      break;
    case "has_secret":
      cellProps["aria-label"] = "Access type";
      break;
    case "fingerprint":
      cellProps["aria-label"] = "Fingerprint";
      break;
    case "actions":
      cellProps["aria-label"] = "Actions";
      break;
  }
  return cellProps;
};
