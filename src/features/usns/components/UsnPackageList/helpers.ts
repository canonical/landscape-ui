import { HTMLProps } from "react";
import { Cell, TableCellProps } from "react-table";
import { UsnPackage } from "@/types/Usn";

export const handleCellProps = ({ column }: Cell<UsnPackage>) => {
  const cellProps: Partial<TableCellProps & HTMLProps<HTMLTableCellElement>> =
    {};

  if (column.id === "name") {
    cellProps.role = "rowheader";
  } else if (column.id === "current_version") {
    cellProps["aria-label"] = "Current version";
  } else if (column.id === "new_version") {
    cellProps["aria-label"] = "New version";
  } else if (column.id === "summary") {
    cellProps["aria-label"] = "Details";
  }

  return cellProps;
};
