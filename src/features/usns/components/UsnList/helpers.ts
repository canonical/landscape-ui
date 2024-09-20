import { HTMLProps, MutableRefObject } from "react";
import {
  Cell,
  Row,
  TableCellProps,
  TableRowProps,
} from "@canonical/react-components/node_modules/@types/react-table";
import { Usn } from "@/types/Usn";
import { EMPTY_USN } from "./constants";
import { ExpandedCell } from "./types";
import classes from "./UsnList.module.scss";

export const getUsnsWithExpanded = ({
  expandedCell,
  isUsnsLoading,
  showSelectAllButton,
  usns,
}: {
  expandedCell: ExpandedCell;
  isUsnsLoading: boolean;
  showSelectAllButton: boolean;
  usns: Usn[];
}) => {
  const rowIndexToInsert =
    expandedCell?.column === "computers_count" ||
    expandedCell?.column === "release_packages"
      ? expandedCell.row + 1
      : 0;

  return [
    ...[EMPTY_USN].slice(showSelectAllButton ? 0 : 1),
    ...usns.slice(0, rowIndexToInsert || usns.length),
    ...usns.slice(rowIndexToInsert ? rowIndexToInsert - 1 : usns.length),
    ...[EMPTY_USN].slice(isUsnsLoading ? 0 : 1),
  ];
};

export const handleCellProps =
  ({
    expandedCell,
    isUsnsLoading,
    lastUsnIndex,
    showSelectAllButton,
  }: {
    expandedCell: ExpandedCell;
    isUsnsLoading: boolean;
    lastUsnIndex?: number;
    showSelectAllButton?: boolean;
  }) =>
  ({ column, row: { index } }: Cell<Usn>) => {
    const cellProps: Partial<TableCellProps & HTMLProps<HTMLTableCellElement>> =
      {};

    if (
      (showSelectAllButton && index === 0) ||
      (isUsnsLoading && index === lastUsnIndex) ||
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
