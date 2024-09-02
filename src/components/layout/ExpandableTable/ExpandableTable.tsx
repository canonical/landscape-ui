import { HTMLProps, isValidElement, ReactNode } from "react";
import { Cell, Column, Row, TableCellProps, TableRowProps } from "react-table";
import { ModularTable } from "@canonical/react-components";
import ExpandableTableFooter from "@/components/layout/ExpandableTableFooter";

interface ExpandableTableProps<T extends Record<string, unknown>> {
  columns: Column<T>[];
  data: T[];
  itemNames: {
    plural: string;
    singular: string;
  };
  onLimitChange: () => void;
  totalCount: number;
  additionalCta?: ReactNode;
  hasNoMoreItems?: boolean;
  getCellProps?: (
    cell: Cell<T>,
  ) => Partial<TableCellProps & HTMLProps<HTMLTableCellElement>>;
  getRowProps?: (
    row: Row<T>,
  ) => Partial<TableRowProps & HTMLProps<HTMLTableRowElement>>;
  itemCount?: number;
  title?: ReactNode;
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
