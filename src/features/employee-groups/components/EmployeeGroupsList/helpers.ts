import { HTMLProps, MutableRefObject } from "react";
import {
  Cell,
  Row,
  TableCellProps,
  TableRowProps,
} from "@canonical/react-components/node_modules/@types/react-table";
import { ExpandedCell } from "./types";
import classes from "./EmployeeGroupsList.module.scss";
import { EmployeeGroup } from "../../types";

const EMPTY_EMPLOYEE_GROUP: EmployeeGroup = {
  id: 0,
  name: "",
  autoinstall_file: "",
  employees: [],
  priority: 0,
};

export const getEmployeeGroupsWithExpanded = ({
  expandedCell,
  isEmployeeGroupsLoading,
  employeeGroups,
}: {
  expandedCell: ExpandedCell;
  isEmployeeGroupsLoading: boolean;
  employeeGroups: EmployeeGroup[];
}) => {
  const rowIndexToInsert =
    expandedCell?.column === "id" ? expandedCell.row + 1 : 0;

  return [
    ...employeeGroups.slice(0, rowIndexToInsert || employeeGroups.length),
    ...employeeGroups.slice(
      rowIndexToInsert ? rowIndexToInsert - 1 : employeeGroups.length,
    ),
    ...[EMPTY_EMPLOYEE_GROUP].slice(isEmployeeGroupsLoading ? 0 : 1),
  ];
};

export const handleCellProps =
  ({
    expandedCell,
    isEmployeeGroupsLoading,
    lastEmployeeGroupIndex,
  }: {
    expandedCell: ExpandedCell;
    isEmployeeGroupsLoading: boolean;
    lastEmployeeGroupIndex?: number;
  }) =>
  ({ column, row: { index } }: Cell<EmployeeGroup>) => {
    const cellProps: Partial<TableCellProps & HTMLProps<HTMLTableCellElement>> =
      {};
    if (
      (isEmployeeGroupsLoading && index === lastEmployeeGroupIndex) ||
      (expandedCell?.row === index - 1 && ["id"].includes(expandedCell.column))
    ) {
      if (column.id === "id") {
        cellProps.colSpan = 6;
        if (
          expandedCell?.row === index - 1 &&
          ["id"].includes(expandedCell.column)
        ) {
          cellProps.className = classes.innerTable;
        }
      } else {
        cellProps.className = classes.hidden;
        cellProps["aria-hidden"] = true;
      }
    } else if (column.id === "id") {
      cellProps.role = "rowheader";
    } else if (column.id === "cves") {
      cellProps["aria-label"] = "CVE(s)";

      if (expandedCell?.column === column.id && expandedCell.row === index) {
        cellProps.className = classes.expandedCell;
      }
    } else if (column.id === "date") {
      cellProps["aria-label"] = "Date published";
    } else if (column.id === "computers_count") {
      cellProps["aria-label"] = "Affected instances";
      cellProps.className =
        expandedCell?.column === column.id && expandedCell.row === index
          ? classes.expanded
          : classes.row;
    } else if (column.id === "release_packages") {
      cellProps["aria-label"] = "Affected packages";
      cellProps.className =
        expandedCell?.column === column.id && expandedCell.row === index
          ? classes.expanded
          : classes.row;
    }

    return cellProps;
  };

export const handleRowProps =
  (expandedCell: ExpandedCell) =>
  ({ index }: Row<EmployeeGroup>) => {
    const rowProps: Partial<TableRowProps & HTMLProps<HTMLTableRowElement>> =
      {};

    if (expandedCell?.column === "name" && expandedCell.row === index) {
      rowProps.className = classes.expandedRow;
    }

    return rowProps;
  };

export const getTableRows =
  (ref: MutableRefObject<HTMLTableRowElement[]>) =>
  (instance: HTMLDivElement | null) => {
    if (!instance) {
      return;
    }

    ref.current = [
      ...instance.querySelectorAll<HTMLTableRowElement>("tbody tr"),
    ];
  };
