import type { Cell, Row, TableCellProps, TableRowProps } from "react-table";
import type { HTMLProps } from "react";
import type { EventLog } from "../../types";

export const getRowProps = (expandedRowIndex: number | null) => {
  return ({
    index,
  }: Row<EventLog>): Partial<
    TableRowProps & HTMLProps<HTMLTableRowElement>
  > => {
    const rowProps: Partial<TableRowProps & HTMLProps<HTMLTableRowElement>> =
      {};

    if (expandedRowIndex === index) {
      rowProps.className = "expandedRow";
    }

    return rowProps;
  };
};

export const getCellProps =
  (expandedRowIndex: number | null) =>
  ({ column, row: { index } }: Cell<EventLog>) => {
    const cellProps: Partial<TableCellProps & HTMLProps<HTMLTableCellElement>> =
      {};

    if (column.id === "creation_time") {
      cellProps.role = "rowheader";
    } else if (column.id === "person_name") {
      cellProps["aria-label"] = "username";
    } else if (column.id === "entity_type") {
      cellProps["aria-label"] = "entity type";
    } else if (column.id === "entity_name") {
      cellProps["aria-label"] = "entity name";
    } else if (column.id === "message") {
      cellProps["aria-label"] = "message";
      if (expandedRowIndex === index) {
        cellProps.className = "expandedCell";
      }
    }
    return cellProps;
  };
