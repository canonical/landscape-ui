import type { HTMLProps } from "react";
import type { Cell, TableCellProps } from "react-table";
import type { EmployeeGroup } from "../../types";

export const handleCellProps =
  () =>
  ({ column }: Cell<EmployeeGroup>) => {
    const cellProps: Partial<TableCellProps & HTMLProps<HTMLTableCellElement>> =
      {};
    if (column.id === "name") {
      cellProps.role = "rowheader";
    } else if (column.id === "employees") {
      cellProps["aria-label"] = "Checkbox";
    } else if (column.id === "employee_count") {
      cellProps["aria-label"] = "Associated employees";
    } else if (column.id === "autoinstall_file.filename") {
      cellProps["aria-label"] = "Autoinstall file";
    } else if (column.id === "priority") {
      cellProps["aria-label"] = "Priority";
    } else if (column.id === "actions") {
      cellProps["aria-label"] = "Actions";
    }

    return cellProps;
  };
