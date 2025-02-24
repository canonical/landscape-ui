import type { HTMLProps } from "react";
import type { Cell, TableCellProps } from "react-table";
import type { AutoinstallFileWithGroups } from "../../types/AutoinstallFile";

export const getCellProps = ({
  column,
}: Cell<AutoinstallFileWithGroups>): Partial<
  TableCellProps & HTMLProps<HTMLTableCellElement>
> => {
  const cellProps: Partial<TableCellProps & HTMLProps<HTMLTableCellElement>> =
    {};

  if (column.id === "name") {
    cellProps.role = "rowheader";
  }

  return cellProps;
};
