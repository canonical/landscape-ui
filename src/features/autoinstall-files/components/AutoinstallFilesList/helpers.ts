import {
  Cell,
  TableCellProps,
} from "@canonical/react-components/node_modules/@types/react-table";
import { AutoinstallFile } from "../../types";
import { HTMLProps } from "react";

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
