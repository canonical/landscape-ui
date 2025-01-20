import {
  Cell,
  Row,
  TableRowProps,
  TableCellProps,
} from "@canonical/react-components/node_modules/@types/react-table";
import { HTMLProps, MutableRefObject } from "react";
import { Employee } from "../../types";
import classes from "./EmployeeList.module.scss";
import { ExpandedCell } from "../EmployeeGroupsList/types";

export const handleRowProps =
  (expandedCell: ExpandedCell) =>
  ({ index }: Row<Employee>) => {
    const rowProps: Partial<TableRowProps & HTMLProps<HTMLTableRowElement>> =
      {};

    if (
      (expandedCell?.column === "associated_instances" ||
        expandedCell?.column === "user_groups") &&
      expandedCell.row === index
    ) {
      rowProps.className = classes.expandedRow;
    }
    return rowProps;
  };

export const handleCellProps =
  (expandedCell: ExpandedCell) =>
  ({ column, row: { index } }: Cell<Employee>) => {
    const cellProps: Partial<TableCellProps & HTMLProps<HTMLTableCellElement>> =
      {};

    if (column.id === "associated_instances") {
      cellProps["aria-label"] = "associated instances";

      if (expandedCell?.column === column.id && expandedCell.row === index) {
        cellProps.className = classes.expandedCell;
      }
    } else if (column.id === "user_groups") {
      cellProps["aria-label"] = "user groups";

      if (expandedCell?.column === column.id && expandedCell.row === index) {
        cellProps.className = classes.expandedCell;
      }
    }

    return cellProps;
  };

export const getTableRows =
  (ref: MutableRefObject<HTMLTableRowElement[]>) =>
  (instance: HTMLDivElement | null) => {
    if (!instance) {
      return;
    }
    ref.current = [
      ...instance.querySelectorAll<HTMLTableRowElement>("tbody tr"),
    ];
  };
