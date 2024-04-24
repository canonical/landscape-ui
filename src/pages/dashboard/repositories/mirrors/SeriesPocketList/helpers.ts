import { Cell, TableCellProps } from "react-table";
import { CommonPocket } from "@/pages/dashboard/repositories/mirrors/SeriesPocketList/types";
import { HTMLProps } from "react";

export const getCellProps = ({ column }: Cell<CommonPocket>) => {
  const cellProps: Partial<TableCellProps & HTMLProps<HTMLTableCellElement>> =
    {};

  if (column.id === "name") {
    cellProps.role = "rowheader";
  } else if (column.id === "mode") {
    cellProps["aria-label"] = "Mode";
  } else if (column.id === "last_sync") {
    cellProps["aria-label"] = "Last synced";
  } else if (column.id === "package_count") {
    cellProps["aria-label"] = "Content";
  } else if (column.id === "actions") {
    cellProps["aria-label"] = "Actions";
  }

  return cellProps;
};
