import type { ProfileChange } from "@/features/tags";
import type { HTMLProps } from "react";
import type { Row, TableRowProps } from "react-table";

export const getRowProps = (
  row: Row<ProfileChange>,
): Partial<TableRowProps & HTMLProps<HTMLTableRowElement>> => {
  const rowProps: Partial<TableRowProps & HTMLProps<HTMLTableRowElement>> = {};

  rowProps["aria-label"] = `${row.original.profile.name} profile change row`;

  return rowProps;
};
