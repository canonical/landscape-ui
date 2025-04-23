import type { HTMLProps, MutableRefObject } from "react";
import type { Script } from "../../types";
import classes from "./ScriptList.module.scss";
import type { ExpandedCell } from "./types";
import type { Cell, Row, TableCellProps, TableRowProps } from "react-table";

export const getCellProps =
  (expandedCell: ExpandedCell) =>
  ({ column, row: { index } }: Cell<Script>) => {
    const cellProps: Partial<TableCellProps & HTMLProps<HTMLTableCellElement>> =
      {};

    if (column.id === "title") {
      cellProps.role = "rowheader";
    } else if (column.id === "access_group") {
      cellProps["aria-label"] = "Access group";
    } else if (column.id === "script_profiles") {
      cellProps["aria-label"] = "Associated script profiles";
      if (expandedCell?.column === column.id && expandedCell.row === index) {
        cellProps.className = classes.expandedCell;
      }
    } else if (column.id === "created_by.name") {
      cellProps["aria-label"] = "Creator";
    } else if (column.id === "last_edited_by.name") {
      cellProps["aria-label"] = "Last modified by";
    } else if (column.id === "id") {
      cellProps["aria-label"] = "Actions";
    }

    return cellProps;
  };

export const handleRowProps =
  (expandedCell: ExpandedCell) =>
  ({ index }: Row<Script>) => {
    const rowProps: Partial<TableRowProps & HTMLProps<HTMLTableRowElement>> =
      {};

    if (
      expandedCell?.column === "script_profiles" &&
      expandedCell.row === index
    ) {
      rowProps.className = classes.expandedRow;
    }
    return rowProps;
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
