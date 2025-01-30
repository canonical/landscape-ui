import type { HTMLProps } from "react";
import type { Cell, TableCellProps } from "react-table";
import type { Constraint } from "../../types";
import classes from "./PackageProfileDetailsConstraintsInfo.module.scss";

export const getCellProps = ({ row, column }: Cell<Constraint>) => {
  const cellProps: Partial<TableCellProps & HTMLProps<HTMLTableCellElement>> =
    {};

  if (row.original.package === "loading") {
    if (column.id === "package") {
      cellProps.colSpan = 3;
    } else {
      cellProps.className = classes.hidden;
      cellProps["aria-hidden"] = true;
    }
  } else {
    if (column.id === "package") {
      cellProps.role = "rowheader";
    } else if (column.id === "constraint") {
      cellProps["aria-label"] = "Constraint";
    } else if (column.id === "rule") {
      cellProps["aria-label"] = "Rule";
    } else if (column.id === "version") {
      cellProps["aria-label"] = "Version";
    }
  }

  return cellProps;
};
