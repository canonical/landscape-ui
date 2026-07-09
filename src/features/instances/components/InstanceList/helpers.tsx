import type { ColumnFilterOption } from "@/components/form/ColumnFilter";
import NoData from "@/components/layout/NoData";
import type { Instance, InstanceWithoutRelation } from "@/types/Instance";
import type { HTMLProps, ReactNode } from "react";
import type {
  Cell,
  HeaderGroup,
  Row,
  TableCellProps,
  TableHeaderProps,
  TableRowProps,
} from "react-table";
import { getInstanceStatuses, getUpgradeStatuses } from "../InstanceStatus";
import type { InstanceColumn } from "./types";

export const getColumnFilterOptions = (
  columns: InstanceColumn[],
): ColumnFilterOption[] => {
  return columns.map(({ accessor, canBeHidden, optionLabel }) => ({
    canBeHidden,
    label: optionLabel,
    value: accessor,
  }));
};

export const getStatusCellIconAndLabel = (
  instance: InstanceWithoutRelation,
): { label: ReactNode; icon?: string } => {
  const statuses = getInstanceStatuses(instance);
  if (statuses.length === 0) {
    return { label: "" };
  }
  if (statuses.length === 1 && statuses[0]) {
    return { label: statuses[0].label, icon: statuses[0].icon };
  }
  return {
    icon: statuses[0]?.icon,
    label: statuses.map((s) => s.label).join(", "),
  };
};

export const getUpgradesCellIconAndLabel = (
  instance: Instance,
): { label: ReactNode; icon?: string } => {
  const statuses = getUpgradeStatuses(instance);
  if (statuses.length === 0) {
    return { icon: "", label: <NoData /> };
  }
  if (statuses.length === 1 && statuses[0]) {
    return { icon: statuses[0].icon, label: statuses[0].label };
  }
  return {
    icon: statuses[0]?.icon,
    label: statuses.map((s) => s.label).join(", "),
  };
};

export const createHeaderPropsGetter = (titleId: string) => {
  return ({ id }: HeaderGroup<Instance>) => {
    const headerProps: Partial<
      TableHeaderProps & HTMLProps<HTMLTableCellElement>
    > = {};

    if (id === "title") {
      headerProps["aria-labelledby"] = titleId;
    }

    return headerProps;
  };
};

export const getCellProps = (
  expandedRowIndex: number | null,
  expandedColumnId: string | null,
) => {
  return ({
    column,
    row: { index },
  }: Cell<Instance>): Partial<
    TableCellProps & HTMLProps<HTMLTableCellElement>
  > => {
    const cellProps: Partial<TableCellProps & HTMLProps<HTMLTableCellElement>> =
      {};

    const isExpandedColumn = (id: string) =>
      expandedRowIndex === index && expandedColumnId === id;

    switch (column.id) {
      case "title":
        cellProps.role = "rowheader";
        break;
      case "status":
        cellProps["aria-label"] = "Status";
        if (isExpandedColumn("status")) {
          cellProps.className = "expandedCell";
        }
        break;
      case "upgrades":
        cellProps["aria-label"] = "Upgrades";
        break;
      case "os":
        cellProps["aria-label"] = "Operating system";
        break;
      case "tags":
        cellProps["aria-label"] = "Tags";
        if (isExpandedColumn("tags")) {
          cellProps.className = "expandedCell";
        }
        break;
      case "availability_zone":
        cellProps["aria-label"] = "Availability zone";
        break;
      case "ubuntu_pro":
        cellProps["aria-label"] = "Ubuntu Pro expiration date";
        break;
      case "last_ping_time":
        cellProps["aria-label"] = "Last ping";
        break;
      case "actions":
        cellProps["aria-label"] = "Actions";
        break;
    }

    return cellProps;
  };
};

export const getRowProps = (expandedRowIndex: number | null) => {
  return ({
    index,
    original,
  }: Row<Instance>): Partial<
    TableRowProps & HTMLProps<HTMLTableRowElement>
  > => {
    const rowProps: Partial<TableRowProps & HTMLProps<HTMLTableRowElement>> =
      {};

    if (expandedRowIndex === index) {
      rowProps.className = "expandedRow";
    }
    rowProps["aria-label"] = `${original.title} instance row`;

    return rowProps;
  };
};
