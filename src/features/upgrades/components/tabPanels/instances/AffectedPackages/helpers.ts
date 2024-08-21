import { HTMLProps } from "react";
import { Cell, TableCellProps } from "react-table";
import { Package } from "@/features/packages";
import classes from "./AffectedPackages.module.scss";

export const handleCellProps =
  ({ loading, showToggle }: { loading: boolean; showToggle: boolean }) =>
  ({ column, row }: Cell<Package>) => {
    const cellProps: Partial<TableCellProps & HTMLProps<HTMLTableCellElement>> =
      {};

    if ((showToggle && row.index === 0) || loading) {
      if (column.id === "checkbox") {
        cellProps.colSpan = 5;
      } else {
        cellProps.className = classes.hidden;
        cellProps["aria-hidden"] = true;
      }
    }

    return cellProps;
  };
