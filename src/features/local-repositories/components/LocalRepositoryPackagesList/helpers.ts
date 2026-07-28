import type { HTMLProps } from "react";
import type { Cell, TableCellProps } from "react-table";
import type { SourcePackage } from "@/features/repositories";

export const getCellProps = (
  cell: Cell<SourcePackage>,
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
