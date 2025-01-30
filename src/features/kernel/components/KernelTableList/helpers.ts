import type { HTMLProps } from "react";
import type { Fix } from "../../types";
import type { Cell, TableCellProps } from "react-table";

export const generateCveLink = (cve: string): string => {
  return `https://cve.mitre.org/cgi-bin/cvename.cgi?name=${cve}`;
};

export const handleCellProps = (cell: Cell<Fix>) => {
  const cellProps: Partial<TableCellProps & HTMLProps<HTMLTableCellElement>> =
    {};
  switch (cell.column.id) {
    case "Name":
      cellProps.role = "rowheader";
      break;
    case "Patched":
      cellProps["aria-label"] = "Status";
      break;
    case "Description":
      cellProps["aria-label"] = "Description";
      break;
    case "Bug":
      cellProps["aria-label"] = "Bug";
      break;
  }

  return cellProps;
};
