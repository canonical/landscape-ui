import { LIST_ACTIONS_COLUMN_PROPS } from "@/components/layout/ListActions";
import type { FC } from "react";
import { useMemo } from "react";
import type { CellProps, Column } from "react-table";
import type { APTSource } from "../../types";
import APTSourcesListActions from "../APTSourcesListActions";
import classes from "./APTSourcesList.module.scss";
import { handleCellProps } from "./helpers";
import ResponsiveTable from "@/components/layout/ResponsiveTable";

interface APTSourcesListProps {
  readonly items: APTSource[];
}

const APTSourcesList: FC<APTSourcesListProps> = ({ items }) => {
  const columns = useMemo<Column<APTSource>[]>(
    () => [
      {
        accessor: "name",
        Header: "Name",
      },
      {
        accessor: "access_group",
        Header: "Access group",
        className: classes.accessGroup,
      },
      {
        accessor: "line",
        Header: "Line",
        className: classes.line,
      },
      {
        ...LIST_ACTIONS_COLUMN_PROPS,
        Cell: ({ row }: CellProps<APTSource>) => (
          <APTSourcesListActions aptSource={row.original} />
        ),
      },
    ],
    [],
  );

  return (
    <ResponsiveTable
      columns={columns}
      data={useMemo(() => items, [items.length])}
      emptyMsg="No APT sources yet."
      getCellProps={handleCellProps}
    />
  );
};

export default APTSourcesList;
