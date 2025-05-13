import type { Cell, Row, TableCellProps, TableRowProps } from "react-table";

import type { HTMLProps } from "react";
import type { EventLog } from "../../types";
import classes from "./EventsLogList.module.scss";

export const handleRowProps =
  (rowIndex?: number) =>
  ({ index }: Row<EventLog>) => {
    const rowProps: Partial<TableRowProps & HTMLProps<HTMLTableRowElement>> =
      {};

    if (rowIndex === index) {
      rowProps.className = classes.expandedRow;
    }

    return rowProps;
  };

export const handleEventLogsCellProps =
  (expandedRowIndex: number) =>
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
        cellProps.className = classes.expandedCell;
      }
    }
    return cellProps;
  };
