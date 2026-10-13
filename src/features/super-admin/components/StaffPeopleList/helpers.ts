import type { HTMLProps } from "react";
import type { Cell, Row, TableCellProps, TableRowProps } from "react-table";
import type { StaffPeopleResult } from "../../types";

/** The shape `StaffPeopleList` hands to its table. */
export interface StaffPeopleRow extends Record<string, unknown> {
  name: string;
  email: string;
  result: StaffPeopleResult;
}

export const getCellProps = ({
  column,
}: Cell<StaffPeopleRow>): Partial<
  TableCellProps & HTMLProps<HTMLTableCellElement>
> => {
  const cellProps: Partial<TableCellProps & HTMLProps<HTMLTableCellElement>> =
    {};

  switch (column.id) {
    case "name":
      cellProps.role = "rowheader";
      break;
    case "email":
      cellProps["aria-label"] = "email";
      break;
    case "status":
      cellProps["aria-label"] = "status";
      break;
    case "accounts":
      cellProps["aria-label"] = "accounts";
      break;
    case "last_login_time":
      cellProps["aria-label"] = "last login";
      break;
  }

  return cellProps;
};

export const getRowProps = ({
  original: { result: original },
}: Row<StaffPeopleRow>): Partial<
  TableRowProps & HTMLProps<HTMLTableRowElement>
> => ({
  "aria-label": `${original.name} ${original.type === "person" ? "user" : "invitation"} row`,
});
