import type { HTMLProps } from "react";
import type { ScriptProfile } from "../../types";
import type { Cell, Row, TableCellProps, TableRowProps } from "react-table";

export const getCellProps = (expandedRowIndex: number | null) => {
  return ({
    column,
    row: { index },
  }: Cell<ScriptProfile>): Partial<
    TableCellProps & HTMLProps<HTMLTableCellElement>
  > => {
    const cellProps: Partial<TableCellProps & HTMLProps<HTMLTableCellElement>> =
      {};
    switch (column.id) {
      case "title":
        cellProps.role = "rowheader";
        break;
      case "archived":
        cellProps["aria-label"] = "Status";
        break;
      case "all_computers":
        cellProps["aria-label"] = "Associated instances";
        break;
      case "tags":
        cellProps["aria-label"] = "Tags";
        if (expandedRowIndex === index) {
          cellProps.className = "expandedCell";
        }
        break;
      case "trigger":
        cellProps["aria-label"] = "Trigger";
        break;
      case "activities.last_activity.creation_time":
        cellProps["aria-label"] = "Last run";
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
  }: Row<ScriptProfile>): Partial<
    TableRowProps & HTMLProps<HTMLTableRowElement>
  > => {
    const rowProps: Partial<TableRowProps & HTMLProps<HTMLTableRowElement>> =
      {};

    if (expandedRowIndex === index) {
      rowProps.className = "expandedRow";
    }
    rowProps["aria-label"] = `${original.title} script profile row`;

    return rowProps;
  };
};
