import type { HTMLProps, RefObject } from "react";
import type { Cell, Row, TableCellProps, TableRowProps } from "react-table";
import type { Script } from "../../types";

export const getTableRowsRef = (
  tableRowsRef: RefObject<HTMLTableRowElement[]>,
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
  }: Cell<Script>): Partial<
    TableCellProps & HTMLProps<HTMLTableCellElement>
  > => {
    const cellProps: Partial<TableCellProps & HTMLProps<HTMLTableCellElement>> =
      {};

    switch (column.id) {
      case "name":
        cellProps.role = "rowheader";
        break;
      case "status":
        cellProps["aria-label"] = "status";
        break;
      case "associated_profiles":
        cellProps["aria-label"] = "associated profiles";

        if (expandedRowIndex === index) {
          cellProps.className = "expandedCell";
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
    original,
  }: Row<Script>): Partial<TableRowProps & HTMLProps<HTMLTableRowElement>> => {
    const rowProps: Partial<TableRowProps & HTMLProps<HTMLTableRowElement>> =
      {};

    if (expandedRowIndex === index) {
      rowProps.className = "expandedRow";
    }
    rowProps["aria-label"] = `${original.title} script row`;

    return rowProps;
  };
};
