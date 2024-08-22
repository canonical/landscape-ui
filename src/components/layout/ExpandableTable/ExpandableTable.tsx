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
  onLimitChange,
  itemCount,
  itemNames,
  totalCount,
  getCellProps,
  getRowProps,
  title,
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
        itemNames={itemNames}
        limit={itemCount ?? data.length}
        onLimitChange={onLimitChange}
        totalCount={totalCount}
      />
    </>
  );
};

export default ExpandableTable;
