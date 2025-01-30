import type { Cell, TableCellProps } from "react-table";
import type { PackageProfile } from "../../types";
import type { HTMLProps } from "react";

export const getCellProps = ({
  column,
}: Cell<PackageProfile>): Partial<
  TableCellProps & HTMLProps<HTMLTableCellElement>
> => {
  const cellProps: Partial<TableCellProps & HTMLProps<HTMLTableCellElement>> =
    {};

  if (column.id === "name") {
    cellProps.role = "rowheader";
  } else if (column.id === "description") {
    cellProps["aria-label"] = "Description";
  } else if (column.id === "access_group") {
    cellProps["aria-label"] = "Access group";
  } else if (column.id === "tags") {
    cellProps["aria-label"] = "Tags";
  } else if (column.id === "computers['non-compliant']") {
    cellProps["aria-label"] = "Not compliant instances";
  } else if (column.id === "computers['pending']") {
    cellProps["aria-label"] = "Pending instances";
  } else if (column.id === "computers['constrained']") {
    cellProps["aria-label"] = "Associated instances";
  } else if (column.id === "actions") {
    cellProps["aria-label"] = "Actions";
  }

  return cellProps;
};
