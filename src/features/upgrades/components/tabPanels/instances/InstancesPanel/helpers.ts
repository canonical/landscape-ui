import { HTMLProps } from "react";
import { Cell, TableCellProps } from "react-table";
import { Instance } from "@/types/Instance";
import classes from "./InstancesPanel.module.scss";

export const handleCellProps =
  (expandedRow: number) =>
  ({ column, row: { index } }: Cell<Instance>) => {
    const cellProps: Partial<TableCellProps & HTMLProps<HTMLTableCellElement>> =
      {};

    if (expandedRow > -1 && expandedRow === index - 1) {
      if (column.id === "title") {
        cellProps.colSpan = 2;
        if (expandedRow > -1 && expandedRow === index - 1) {
          cellProps.className = classes.innerTable;
        }
      } else {
        cellProps.className = classes.hidden;
        cellProps["aria-hidden"] = true;
      }
    } else if (column.id === "title") {
      cellProps.role = "rowheader";
    } else if (column.id === "upgrades") {
      cellProps["aria-label"] = "Affected packages";
      cellProps.className =
        expandedRow === index ? classes.expanded : classes.row;
    }

    return cellProps;
  };
