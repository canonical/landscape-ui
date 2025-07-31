import type { WindowsInstance } from "@/types/Instance";
import type { HTMLProps } from "react";
import type { Cell, Row, TableCellProps, TableRowProps } from "react-table";

export const getCellProps = (expandedRowIndex: number | null) => {
  return ({
    column,
    row: { index },
  }: Cell<WindowsInstance>): Partial<
    TableCellProps & HTMLProps<HTMLTableCellElement>
  > => {
    if (column.id === "profiles" && expandedRowIndex === index) {
      return { className: "expandedCell" };
    } else {
      return {};
    }
  };
};

export const getRowProps = (expandedRowIndex: number | null) => {
  return ({
    index,
  }: Row<WindowsInstance>): Partial<
    TableRowProps & HTMLProps<HTMLTableRowElement>
  > => {
    if (expandedRowIndex === index) {
      return { className: "expandedRow" };
    } else {
      return {};
    }
  };
};
