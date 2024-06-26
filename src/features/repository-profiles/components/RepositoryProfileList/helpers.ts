import { Cell, TableCellProps } from "react-table";
import { RepositoryProfile } from "../../types";
import { HTMLProps } from "react";

export const handleCellProps = ({ column }: Cell<RepositoryProfile>) => {
  const cellProps: Partial<TableCellProps & HTMLProps<HTMLTableCellElement>> =
    {};

  if (column.id === "title") {
    cellProps.role = "rowheader";
  } else if (column.id === "description") {
    cellProps["aria-label"] = "Description";
  } else if (column.id === "access_group") {
    cellProps["aria-label"] = "Access group";
  } else if (column.id === "id") {
    cellProps["aria-label"] = "Actions";
  }

  return cellProps;
};
