import type { HTMLProps, RefObject } from "react";
import type { Cell, Row, TableCellProps, TableRowProps } from "react-table";
import type { ExpandedCell } from "@/types/ExpandedCell";
import type { Employee } from "../../types";

export const handleRowProps =
  (expandedCell: ExpandedCell) =>
  ({ index }: Row<Employee>) => {
    const rowProps: Partial<TableRowProps & HTMLProps<HTMLTableRowElement>> =
      {};

    if (expandedCell?.column === "computers" && expandedCell.row === index) {
      rowProps.className = "expandedRow";
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
        cellProps.className = "expandedCell";
      }
    } else if (column.id === "name") {
      cellProps.role = "rowheader";
    } else if (column.id === "email") {
      cellProps["aria-label"] = "Email";
    } else if (column.id === "status") {
      cellProps["aria-label"] = "Status";
    } else if (column.id === "actions") {
      cellProps["aria-label"] = "Actions";
    }

    return cellProps;
  };

export const getTableRows =
  (ref: RefObject<HTMLTableRowElement[]>) =>
  (instance: HTMLDivElement | null) => {
    if (!instance) {
      return;
    }
    ref.current = [
      ...instance.querySelectorAll<HTMLTableRowElement>("tbody tr"),
    ];
  };
