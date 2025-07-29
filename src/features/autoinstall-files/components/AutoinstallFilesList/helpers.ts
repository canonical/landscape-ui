import type { HTMLProps } from "react";
import type { Cell, TableCellProps, TableRowProps } from "react-table";
import type { AutoinstallFile } from "../../types";

export const getCellProps = ({
  column,
}: Cell<AutoinstallFile>): Partial<
  TableCellProps & HTMLProps<HTMLTableCellElement>
> => {
  {
    const cellProps: Partial<TableCellProps & HTMLProps<HTMLTableCellElement>> =
      {};

    switch (column.id) {
      case "filename":
        cellProps.role = "rowheader";
        break;
      case "last_modified_at":
        cellProps["aria-label"] = "last modified at";
        break;
    }

    return cellProps;
  }
};

export const getRowProps = () => {
  {
    const rowProps: Partial<TableRowProps & HTMLProps<HTMLTableRowElement>> =
      {};

    return rowProps;
  }
};
