import { LIST_ACTIONS_COLUMN_PROPS } from "@/components/layout/ListActions";
import { pluralize } from "@/utils/_helpers";
import type { FC, ReactNode } from "react";
import { useMemo } from "react";
import type { CellProps, Column } from "react-table";
import type { Distribution, Pocket, Series, SyncPocketRef } from "../../types";
import PocketSyncActivity from "../PocketSyncActivity";
import SeriesPocketDetailsButton from "../SeriesPocketDetailsButton";
import SeriesPocketListActions from "../SeriesPocketListActions";
import { getCellProps } from "./helpers";
import type { CommonPocket } from "./types";
import ResponsiveTable from "@/components/layout/ResponsiveTable";

interface SeriesPocketListProps {
  readonly distributionName: Distribution["name"];
  readonly series: Series;
  readonly syncPocketRefAdd: (ref: SyncPocketRef) => void;
  readonly syncPocketRefs: SyncPocketRef[];
}

const SeriesPocketList: FC<SeriesPocketListProps> = ({
  distributionName,
  series,
  syncPocketRefAdd,
  syncPocketRefs,
}) => {
  const pockets = useMemo<CommonPocket[]>(
    () => series.pockets as CommonPocket[],
    [series.pockets],
  );

  const columns = useMemo<Column<CommonPocket>[]>(
    () => [
      {
        accessor: "name",
        Header: "Pocket",
        Cell: ({ row: { original } }: CellProps<CommonPocket>): ReactNode => (
          <SeriesPocketDetailsButton
            distributionName={distributionName}
            pocket={original as Pocket}
            seriesName={series.name}
          />
        ),
      },
      {
        accessor: "mode",
        Header: "Mode",
      },
      {
        accessor: "last_sync",
        Header: "Last synced",
        className: "date-cell",
        Cell: ({ row: { original } }: CellProps<CommonPocket>): ReactNode => (
          <PocketSyncActivity
            pocket={original as Pocket}
            syncPocketRefAdd={syncPocketRefAdd}
            syncPocketRefs={syncPocketRefs}
          />
        ),
      },
      {
        accessor: "package_count",
        Header: "Content",
        Cell: ({ row: { original } }: CellProps<CommonPocket>): ReactNode => (
          <>{`${original.package_count} ${pluralize(
            original.package_count,
            "package",
          )}`}</>
        ),
      },
      {
        ...LIST_ACTIONS_COLUMN_PROPS,
        Cell: ({ row: { original } }: CellProps<CommonPocket>): ReactNode => (
          <SeriesPocketListActions
            distributionName={distributionName}
            pocket={original as Pocket}
            seriesName={series.name}
            syncPocketRefs={syncPocketRefs}
          />
        ),
      },
    ],
    [pockets, syncPocketRefs],
  );

  return (
    <ResponsiveTable
      columns={columns}
      data={pockets}
      getCellProps={getCellProps}
      emptyMsg="No pockets yet"
    />
  );
};

export default SeriesPocketList;
