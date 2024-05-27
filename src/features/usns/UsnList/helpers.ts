import { HTMLProps, MutableRefObject } from "react";
import { Cell, Row, TableCellProps, TableRowProps } from "react-table";
import { USN_EXPANDED } from "@/features/usns/UsnList/constants";
import { Usn } from "@/types/Usn";
import classes from "./UsnList.module.scss";

export const getUsnsWithExpanded = (
  usns: Usn[],
  expandedUsn: string,
  tableType: "expandable" | "paginated",
  usnLimit: number,
) => {
  if (expandedUsn === "") {
    return tableType === "expandable" ? usns.slice(0, usnLimit) : usns;
  }

  const indexToInsertPackageTable =
    usns.findIndex(({ usn }) => usn === expandedUsn) + 1;

  return [
    ...usns.slice(0, indexToInsertPackageTable),
    USN_EXPANDED,
    ...usns.slice(
      indexToInsertPackageTable,
      tableType === "expandable" ? usnLimit : usns.length,
    ),
  ];
};

export const handleSecurityIssuesCellProps =
  (
    tableType: "expandable" | "paginated",
    expandedRowIndex: number,
    expandedUsn: string,
  ) =>
  ({
    column,
    row: {
      original: { usn },
      index,
    },
  }: Cell<Usn>) => {
    const cellProps: Partial<TableCellProps & HTMLProps<HTMLTableCellElement>> =
      {};

    if (usn === expandedUsn) {
      if (column.id === "release_packages") {
        cellProps.className = classes.expanded;
      }
    } else if (["expandedUsn", "loading"].includes(usn)) {
      if (column.id === "usn") {
        cellProps.colSpan = tableType === "expandable" ? 4 : 5;
        if (usn === "expandedUsn") {
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

      if (expandedRowIndex === index) {
        cellProps.className = classes.expandedCell;
      }
    } else if (column.id === "date") {
      cellProps["aria-label"] = "Date published";
    } else if (column.id === "release_packages") {
      cellProps["aria-label"] = "Affected packages";
    }

    return cellProps;
  };

export const handleRowProps =
  (rowIndex?: number) =>
  ({ index }: Row<Usn>) => {
    const rowProps: Partial<TableRowProps & HTMLProps<HTMLTableRowElement>> =
      {};

    if (rowIndex === index) {
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
