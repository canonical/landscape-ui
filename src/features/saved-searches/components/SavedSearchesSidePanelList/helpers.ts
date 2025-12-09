import type { HTMLProps } from "react";
import type { Cell, Row, TableCellProps, TableRowProps } from "react-table";
import type { SavedSearch } from "../../types";

export const getCellProps =
  (expandedRowIndex: number | null) =>
  (
    cell: Cell<SavedSearch>,
  ): Partial<TableCellProps & HTMLProps<HTMLTableCellElement>> => {
    const cellProps: Partial<TableCellProps & HTMLProps<HTMLTableCellElement>> =
      {};

    if (cell.column.id === "search" && cell.row.index === expandedRowIndex) {
      cellProps.className = "expandedCell";
    }

    return cellProps;
  };

export const getRowProps =
  (expandedRowIndex: number | null) =>
  (
    row: Row<SavedSearch>,
  ): Partial<TableRowProps & HTMLProps<HTMLTableRowElement>> => {
    const rowProps: Partial<TableRowProps & HTMLProps<HTMLTableRowElement>> =
      {};

    if (row.index === expandedRowIndex) {
      rowProps.className = "expandedRow";
    }

    return rowProps;
  };
