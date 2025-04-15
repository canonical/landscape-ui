import type { HTMLProps, MutableRefObject } from "react";
import type { Cell, Row, TableCellProps, TableRowProps } from "react-table";
import type { ExpandedCell } from "../../../employee-groups/components/EmployeeGroupsList/types";
import type { Employee } from "../../types";
import classes from "./EmployeeList.module.scss";

export const handleRowProps =
  (expandedCell: ExpandedCell) =>
  ({ index }: Row<Employee>) => {
    const rowProps: Partial<TableRowProps & HTMLProps<HTMLTableRowElement>> =
      {};

    if (
      (expandedCell?.column === "computers" ||
        expandedCell?.column === "groups") &&
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
    if (column.id === "computers") {
      cellProps["aria-label"] = "Associated instances";

      if (expandedCell?.column === column.id && expandedCell.row === index) {
        cellProps.className = classes.expandedCell;
      }
    } else if (column.id === "groups") {
      cellProps["aria-label"] = "Employee group";

      if (expandedCell?.column === column.id && expandedCell.row === index) {
        cellProps.className = classes.expandedCell;
      }
    } else if (column.id === "name") {
      cellProps.role = "rowheader";
    } else if (column.id === "email") {
      cellProps["aria-label"] = "Email";
    } else if (column.id === "status") {
      cellProps["aria-label"] = "Status";
    } else if (column.id === "autoinstall_file") {
      cellProps["aria-label"] = "Assigned autoinstall file";
    } else if (column.id === "actions") {
      cellProps["aria-label"] = "Actions";
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
