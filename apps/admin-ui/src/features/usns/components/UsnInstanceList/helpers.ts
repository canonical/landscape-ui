import type { HTMLProps } from "react";
import type { Cell, TableCellProps } from "react-table";
import type { Instance } from "@/types/Instance";

export const handleCellProps = ({ column }: Cell<Instance>) => {
  const cellProps: Partial<TableCellProps & HTMLProps<HTMLTableCellElement>> =
    {};

  if (column.id === "title") {
    cellProps.role = "rowheader";
  } else if (column.id === "upgrades.security") {
    cellProps["aria-label"] = "Affected packages";
  }

  return cellProps;
};
