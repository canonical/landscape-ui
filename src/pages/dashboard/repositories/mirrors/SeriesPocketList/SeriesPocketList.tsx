import classNames from "classnames";
import { FC, useMemo } from "react";
import { CellProps, Column } from "react-table";
import { useMediaQuery } from "usehooks-ts";
import { Col, ModularTable, Row } from "@canonical/react-components";
import InfoItem from "@/components/layout/InfoItem";
import PocketSyncActivity from "@/pages/dashboard/repositories/mirrors/PocketSyncActivity";
import SeriesPocketDetailsButton from "@/pages/dashboard/repositories/mirrors/SeriesPocketDetailsButton";
import SeriesPocketListActions from "@/pages/dashboard/repositories/mirrors/SeriesPocketListActions";
import { SyncPocketRef } from "@/pages/dashboard/repositories/mirrors/types";
import { Distribution } from "@/types/Distribution";
import { Pocket } from "@/types/Pocket";
import { Series } from "@/types/Series";
import { getCellProps } from "./helpers";
import { CommonPocket } from "./types";
import classes from "./SeriesPocketList.module.scss";

interface SeriesPocketListProps {
  distributionName: Distribution["name"];
  series: Series;
  syncPocketRefAdd: (ref: SyncPocketRef) => void;
  syncPocketRefs: SyncPocketRef[];
}

const SeriesPocketList: FC<SeriesPocketListProps> = ({
  distributionName,
  series,
  syncPocketRefAdd,
  syncPocketRefs,
}) => {
  const isLargerScreen = useMediaQuery("(min-width: 620px)");

  const pockets = useMemo<CommonPocket[]>(
    () => series.pockets as CommonPocket[],
    [series.pockets],
  );

  const columns = useMemo<Column<CommonPocket>[]>(
    () => [
      {
        accessor: "name",
        Header: "Pocket",
        Cell: ({ row: { original } }: CellProps<CommonPocket>) => (
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
        Cell: ({ row: { original } }: CellProps<CommonPocket>) => (
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
        Cell: ({ row: { original } }: CellProps<CommonPocket>) => (
          <>{`${original.package_count} ${
            original.package_count !== 1 ? "packages" : "package"
          }`}</>
        ),
      },
      {
        accessor: "actions",
        Cell: ({ row: { original } }: CellProps<CommonPocket>) => (
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

  return isLargerScreen ? (
    <ModularTable
      columns={columns}
      data={pockets}
      getCellProps={getCellProps}
      emptyMsg="No pockets yet"
    />
  ) : (
    series.pockets.map((pocket, index) => (
      <Row
        key={index}
        className={classNames(
          "u-no-padding--left u-no-padding--right",
          classes.pocketWrapper,
        )}
      >
        <Col size={2} small={2}>
          <InfoItem
            label="Pocket"
            value={
              <SeriesPocketDetailsButton
                distributionName={distributionName}
                pocket={pocket}
                seriesName={series.name}
              />
            }
          />
        </Col>
        <Col size={2} small={2}>
          <InfoItem
            label="Last synced"
            value={
              <PocketSyncActivity
                pocket={pocket}
                syncPocketRefAdd={syncPocketRefAdd}
                syncPocketRefs={syncPocketRefs}
              />
            }
          />
        </Col>
        <Col size={2} small={2}>
          <InfoItem label="Mode" value={pocket.mode} />
        </Col>
        <Col size={2} small={2}>
          <InfoItem
            label="Content"
            value={
              <>{`${pocket.package_count} ${
                pocket.package_count !== 1 ? "packages" : "package"
              }`}</>
            }
          />
        </Col>
        <div className={classes.ctaRow}>
          <SeriesPocketListActions
            distributionName={distributionName}
            pocket={pocket}
            seriesName={series.name}
            syncPocketRefs={syncPocketRefs}
          />
        </div>
      </Row>
    ))
  );
};

export default SeriesPocketList;
