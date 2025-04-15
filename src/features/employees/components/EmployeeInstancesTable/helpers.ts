import type { HTMLProps } from "react";
import type { Cell, TableCellProps } from "react-table";
import type { Instance } from "@/types/Instance";

export const handleCellProps =
  () =>
  ({ column }: Cell<Instance>) => {
    const cellProps: Partial<TableCellProps & HTMLProps<HTMLTableCellElement>> =
      {};
    if (column.id === "name") {
      cellProps.role = "rowheader";
    } else if (column.id === "status") {
      cellProps["aria-label"] = "Status";
    } else if (column.id === "recovery_key") {
      cellProps["aria-label"] = "Recovery key";
    } else if (column.id === "actions") {
      cellProps["aria-label"] = "Actions";
    }

    return cellProps;
  };
