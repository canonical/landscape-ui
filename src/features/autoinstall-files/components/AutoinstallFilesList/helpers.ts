import type { HTMLProps, MutableRefObject } from "react";
import type { Cell, Row, TableCellProps, TableRowProps } from "react-table";
import type { AutoinstallFileWithGroups } from "../../types";
import classes from "./AutoinstallFilesList.module.scss";

export const getTableRowsRef = (
  tableRowsRef: MutableRefObject<HTMLTableRowElement[]>,
) => {
  return (instance: HTMLDivElement | null): void => {
    if (!instance) {
      return;
    }

    tableRowsRef.current = [
      ...instance.querySelectorAll<HTMLTableRowElement>("tbody tr"),
    ];
  };
};

export const getCellProps = (expandedRowIndex: number | null) => {
  return ({
    column,
    row: { index },
  }: Cell<AutoinstallFileWithGroups>): Partial<
    TableCellProps & HTMLProps<HTMLTableCellElement>
  > => {
    const cellProps: Partial<TableCellProps & HTMLProps<HTMLTableCellElement>> =
      {};

    switch (column.id) {
      case "filename":
        cellProps.role = "rowheader";
        break;
      case "groups":
        cellProps["aria-label"] = "employee groups";

        if (expandedRowIndex === index) {
          cellProps.className = classes.expandedCell;
        }
        break;
      case "last_modified_at":
        cellProps["aria-label"] = "last modified at";
        break;
      case "created_at":
        cellProps["aria-label"] = "created at";
        break;
    }

    return cellProps;
  };
};

export const getRowProps = (expandedRowIndex: number | null) => {
  return ({
    index,
  }: Row<AutoinstallFileWithGroups>): Partial<
    TableRowProps & HTMLProps<HTMLTableRowElement>
  > => {
    const rowProps: Partial<TableRowProps & HTMLProps<HTMLTableRowElement>> =
      {};

    if (expandedRowIndex === index) {
      rowProps.className = classes.expandedRow;
    }

    return rowProps;
  };
};
