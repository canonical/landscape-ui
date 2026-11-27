import type { Instance } from "@/types/Instance";
import type { HTMLProps } from "react";
import type {
  Cell,
  HeaderGroup,
  Row,
  TableCellProps,
  TableHeaderProps,
  TableRowProps,
} from "react-table";

const CELL_LABELS: Record<string, string> = {
  status: "Status",
  upgrades: "Upgrades",
  os: "Operating system",
  tags: "Tags",
  availability_zone: "Availability zone",
  ubuntu_pro: "Ubuntu Pro expiration date",
  last_ping_time: "Last ping",
};

export const createHeaderPropsGetter =
  (titleId: string) =>
  ({
    id,
  }: HeaderGroup<Instance>): Partial<
    TableHeaderProps & HTMLProps<HTMLTableCellElement>
  > =>
    id === "title" ? { "aria-labelledby": titleId } : {};

export const getCellProps =
  (expandedRowIndex: number | null, expandedColumnId: string | null) =>
  ({
    column,
    row: { index },
  }: Cell<Instance>): Partial<
    TableCellProps & HTMLProps<HTMLTableCellElement>
  > => {
    if (column.id === "title") {
      return { role: "rowheader" };
    }

    const isExpanded =
      expandedRowIndex === index && expandedColumnId === column.id;

    return {
      "aria-label": CELL_LABELS[column.id],
      ...(isExpanded && { className: "expandedCell" }),
    };
  };

export const getRowProps =
  (expandedRowIndex: number | null) =>
  ({
    index,
    original,
  }: Row<Instance>): Partial<
    TableRowProps & HTMLProps<HTMLTableRowElement>
  > => ({
    "aria-label": `${original.title} instance row`,
    ...(expandedRowIndex === index && { className: "expandedRow" }),
  });
