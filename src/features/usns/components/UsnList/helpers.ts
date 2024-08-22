import { HTMLProps, MutableRefObject } from "react";
import { Cell, Row, TableCellProps, TableRowProps } from "react-table";
import { Usn } from "@/types/Usn";
import { EMPTY_USN } from "./constants";
import { ExpandedCell } from "./types";
import classes from "./UsnList.module.scss";

export const getUsnsWithExpanded = (
  usns: Usn[],
  expandedCell: ExpandedCell,
  isFetchingNextPage: boolean,
) => {
  if (
    expandedCell?.column !== "computers_count" &&
    expandedCell?.column !== "release_packages"
  ) {
    return isFetchingNextPage ? [...usns, EMPTY_USN] : usns;
  }

  return [
    ...usns.slice(0, expandedCell.row + 1),
    ...usns.slice(expandedCell.row),
    ...[EMPTY_USN].slice(isFetchingNextPage ? -1 : 0),
  ];
};

export const handleCellProps =
  (expandedCell: ExpandedCell, isLoading: boolean, lastUsnIndex?: number) =>
  ({ column, row: { index } }: Cell<Usn>) => {
    const cellProps: Partial<TableCellProps & HTMLProps<HTMLTableCellElement>> =
      {};

    if (
      (isLoading && index === lastUsnIndex) ||
      (expandedCell?.row === index - 1 &&
        ["computers_count", "release_packages"].includes(expandedCell.column))
    ) {
      if (column.id === "usn") {
        cellProps.colSpan = 5;
        if (
          expandedCell?.row === index - 1 &&
          ["computers_count", "release_packages"].includes(expandedCell.column)
        ) {
          cellProps.className = classes.innerTable;
        }
      } else {
        cellProps.className = classes.hidden;
        cellProps["aria-hidden"] = true;
      }
    } else if (column.id === "usn") {
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
  ({ index }: Row<Usn>) => {
    const rowProps: Partial<TableRowProps & HTMLProps<HTMLTableRowElement>> =
      {};

    if (expandedCell?.column === "cves" && expandedCell.row === index) {
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
