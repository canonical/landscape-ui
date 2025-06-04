import type { UpgradeProfile } from "../../types";
import type { HTMLProps } from "react";
import type { Cell, Row, TableCellProps, TableRowProps } from "react-table";

export const getCellProps = (expandedRowIndex: number | null) => {
  return ({
    column,
    row: { index },
  }: Cell<UpgradeProfile>): Partial<
    TableCellProps & HTMLProps<HTMLTableCellElement>
  > => {
    const cellProps: Partial<TableCellProps & HTMLProps<HTMLTableCellElement>> =
      {};

    switch (column.id) {
      case "name":
        cellProps.role = "rowheader";
        break;
      case "access_group":
        cellProps["aria-label"] = "Access group";
        break;
      case "tags":
        cellProps["aria-label"] = "Tags";
        if (expandedRowIndex === index) {
          cellProps.className = "expandedCell";
        }
        break;
      case "associated":
        cellProps["aria-label"] = "Associated instances";
        break;
      case "actions":
        cellProps["aria-label"] = "Actions";
        break;
    }

    return cellProps;
  };
};

export const getRowProps = (expandedRowIndex: number | null) => {
  return ({
    index,
    original,
  }: Row<UpgradeProfile>): Partial<
    TableRowProps & HTMLProps<HTMLTableRowElement>
  > => {
    const rowProps: Partial<TableRowProps & HTMLProps<HTMLTableRowElement>> =
      {};

    if (expandedRowIndex === index) {
      rowProps.className = "expandedRow";
    }
    rowProps["aria-label"] = `${original.title} upgrade profile row`;

    return rowProps;
  };
};
