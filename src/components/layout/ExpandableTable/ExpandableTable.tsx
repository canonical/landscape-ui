import { HTMLProps, ReactNode } from "react";
import { Cell, Column, TableCellProps } from "react-table";
import { ModularTable } from "@canonical/react-components";
import ExpandableTableFooter from "@/components/layout/ExpandableTableFooter";

interface ExpandableTableProps<T extends Record<string, unknown>> {
  columns: Column<T>[];
  data: T[];
  itemNames: {
    plural: string;
    singular: string;
  };
  limit: number;
  onLimitChange: () => void;
  totalCount: number;
  additionalCta?: ReactNode[];
  title?: string;
  getCellProps?:
    | ((
        cell: Cell<T>,
      ) => Partial<TableCellProps & HTMLProps<HTMLTableCellElement>>)
    | undefined;
}

const ExpandableTable = <T extends Record<string, unknown>>({
  additionalCta,
  columns,
  data,
  limit,
  onLimitChange,
  itemNames,
  totalCount,
  getCellProps,
  title,
}: ExpandableTableProps<T>) => {
  return (
    <>
      {title && <p className="p-heading--5">{title}</p>}
      <ModularTable
        columns={columns}
        data={data}
        className="u-no-margin--bottom"
        getCellProps={getCellProps}
      />
      <ExpandableTableFooter
        additionalCta={additionalCta}
        itemNames={itemNames}
        limit={limit}
        onLimitChange={onLimitChange}
        totalCount={totalCount}
      />
    </>
  );
};

export default ExpandableTable;
