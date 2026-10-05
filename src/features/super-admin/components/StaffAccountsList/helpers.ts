import type { HTMLProps } from "react";
import type { Cell, Row, TableCellProps, TableRowProps } from "react-table";
import type { StaffAccountListItem } from "../../types";

export const getCellProps = ({
  column,
}: Cell<StaffAccountListItem>): Partial<
  TableCellProps & HTMLProps<HTMLTableCellElement>
> => {
  const cellProps: Partial<TableCellProps & HTMLProps<HTMLTableCellElement>> =
    {};

  switch (column.id) {
    case "account":
      cellProps.role = "rowheader";
      break;
    case "company":
      cellProps["aria-label"] = "title";
      break;
    case "subdomain":
      cellProps["aria-label"] = "subdomain";
      break;
    case "computers":
      cellProps["aria-label"] = "instances";
      break;
    case "status":
      cellProps["aria-label"] = "status";
      break;
    case "creation_time":
      cellProps["aria-label"] = "created";
      break;
  }

  return cellProps;
};

export const getRowProps = ({
  original,
}: Row<StaffAccountListItem>): Partial<
  TableRowProps & HTMLProps<HTMLTableRowElement>
> => ({
  "aria-label": `${original.account} account row`,
});
