import type { HTMLProps, ReactNode } from "react";
import { isValidElement } from "react";
import type {
  Cell,
  Column,
  Row,
  TableCellProps,
  TableRowProps,
} from "react-table";
import { ModularTable } from "@canonical/react-components";
import ExpandableTableFooter from "@/components/layout/ExpandableTableFooter";

interface ExpandableTableProps<T extends Record<string, unknown>> {
  readonly columns: Column<T>[];
  readonly data: T[];
  readonly itemNames: {
    plural: string;
    singular: string;
  };
  readonly onLimitChange: () => void;
  readonly totalCount: number;
  readonly additionalCta?: ReactNode;
  readonly hasNoMoreItems?: boolean;
  readonly getCellProps?: (
    cell: Cell<T>,
  ) => Partial<TableCellProps & HTMLProps<HTMLTableCellElement>>;
  readonly getRowProps?: (
    row: Row<T>,
  ) => Partial<TableRowProps & HTMLProps<HTMLTableRowElement>>;
  readonly itemCount?: number;
  readonly title?: ReactNode;
}

const ExpandableTable = <T extends Record<string, unknown>>({
  additionalCta,
  columns,
  data,
  hasNoMoreItems,
  getCellProps,
  getRowProps,
  itemCount,
  itemNames,
  onLimitChange,
  title,
  totalCount,
}: ExpandableTableProps<T>) => {
  return (
    <>
      {typeof title === "string" && <p className="p-heading--5">{title}</p>}
      {isValidElement(title) && title}
      <ModularTable
        columns={columns}
        data={data}
        className="u-no-margin--bottom"
        getCellProps={getCellProps}
        getRowProps={getRowProps}
      />
      <ExpandableTableFooter
        additionalCta={additionalCta}
        hasNoMoreItems={hasNoMoreItems}
        itemCount={itemCount ?? data.length}
        itemNames={itemNames}
        onLimitChange={onLimitChange}
        totalCount={totalCount}
      />
    </>
  );
};

export default ExpandableTable;
