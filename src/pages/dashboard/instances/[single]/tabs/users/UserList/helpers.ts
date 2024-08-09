import { User } from "@/types/User";
import { HTMLProps } from "react";
import { Cell, TableCellProps } from "react-table";

export const handleCellProps = ({ column }: Cell<User>) => {
  const cellProps: Partial<TableCellProps & HTMLProps<HTMLTableCellElement>> =
    {};

  switch (column.id) {
    case "username":
      cellProps.role = "rowheader";
      break;
    case "enabled":
      cellProps["aria-label"] = "Status";
      break;
    case "uid":
      cellProps["aria-label"] = "User id";
      break;
    case "name":
      cellProps["aria-label"] = "Full name";
      break;
  }

  return cellProps;
};
