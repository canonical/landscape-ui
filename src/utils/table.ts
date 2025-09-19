import type { HTMLProps } from "react";
import type { Cell, Row, TableCellProps, TableRowProps } from "react-table";

interface TablePropGettersOptions {
  itemTypeName: string;
  headerColumnId: string;
}

export const createTablePropGetters = <T extends { title: string }>({
  itemTypeName,
  headerColumnId,
}: TablePropGettersOptions) => {
  const getRowProps =
    (expandedRowIndex: number | null = null) =>
    (row: Row<T>): Partial<TableRowProps & HTMLProps<HTMLTableRowElement>> => {
      const { index, original } = row;
      const rowProps: Partial<TableRowProps & HTMLProps<HTMLTableRowElement>> =
        {};

      if (expandedRowIndex === index) {
        rowProps.className = "expandedRow";
      }

      rowProps["aria-label"] = `${original.title} ${itemTypeName} row`;

      return rowProps;
    };

  const getCellProps =
    (
      expandedRowIndex: number | null = null,
      expandedColumnId: string | null = null,
    ) =>
    (
      cell: Cell<T>,
    ): Partial<TableCellProps & HTMLProps<HTMLTableCellElement>> => {
      const { column, row } = cell;
      const cellProps: Partial<
        TableCellProps & HTMLProps<HTMLTableCellElement>
      > = {};

      if (column.id === headerColumnId) {
        cellProps.role = "rowheader";
      }

      if (column.meta?.ariaLabel) {
        if (typeof column.meta.ariaLabel === "function") {
          cellProps["aria-label"] = column.meta.ariaLabel(row);
        } else {
          cellProps["aria-label"] = column.meta.ariaLabel;
        }
      }

      if (
        column.meta?.isExpandable &&
        expandedRowIndex === row.index &&
        expandedColumnId === column.id
      ) {
        cellProps.className = "expandedCell";
      }

      return cellProps;
    };

  return { getRowProps, getCellProps };
};
