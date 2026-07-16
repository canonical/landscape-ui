import type { HTMLProps } from "react";
import type { Cell, TableCellProps } from "react-table";
import type { LocalPackage } from "../../types";

export const getCellProps = (
  cell: Cell<LocalPackage>,
): Partial<TableCellProps & HTMLProps<HTMLTableCellElement>> => {
  const { column, row } = cell;

  if (!column.meta?.ariaLabel) {
    return {};
  }

  return {
    "aria-label":
      typeof column.meta.ariaLabel === "function"
        ? column.meta.ariaLabel(row)
        : column.meta.ariaLabel,
  };
};
