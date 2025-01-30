import type { GPGKey } from "../../types";
import type { Cell, TableCellProps } from "react-table";
import type { HTMLProps } from "react";

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
