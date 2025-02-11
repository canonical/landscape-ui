import type { Cell, TableCellProps } from "react-table";
import type { AutoinstallFile } from "../../types";
import type { HTMLProps } from "react";

export const getCellProps = ({
  column,
}: Cell<AutoinstallFile>): Partial<
  TableCellProps & HTMLProps<HTMLTableCellElement>
> => {
  const cellProps: Partial<TableCellProps & HTMLProps<HTMLTableCellElement>> =
    {};

  if (column.id === "name") {
    cellProps.role = "rowheader";
  }

  return cellProps;
};
