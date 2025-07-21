import type { HTMLProps } from "react";
import type { Cell, Row, TableCellProps, TableRowProps } from "react-table";
import type { PackageProfile } from "../../types";

export const getCellProps = (expandedRowIndex: number | null) => {
  return ({
    column,
    row: { index },
  }: Cell<PackageProfile>): Partial<
    TableCellProps & HTMLProps<HTMLTableCellElement>
  > => {
    const cellProps: Partial<TableCellProps & HTMLProps<HTMLTableCellElement>> =
      {};

    switch (column.id) {
      case "title":
        cellProps.role = "rowheader";
        break;
      case "description":
        cellProps["aria-label"] = "Description";
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
      case "computers['non-compliant']":
        cellProps["aria-label"] = "Not compliant instances";
        break;
      case "computers['pending']":
        cellProps["aria-label"] = "Pending instances";
        break;
      case "computers['constrained']":
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
  }: Row<PackageProfile>): Partial<
    TableRowProps & HTMLProps<HTMLTableRowElement>
  > => {
    const rowProps: Partial<TableRowProps & HTMLProps<HTMLTableRowElement>> =
      {};

    if (expandedRowIndex === index) {
      rowProps.className = "expandedRow";
    }
    rowProps["aria-label"] = `${original.title} package profile row`;

    return rowProps;
  };
};
