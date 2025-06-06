import LoadingState from "@/components/layout/LoadingState";
import NoData from "@/components/layout/NoData";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import useSidePanel from "@/hooks/useSidePanel";
import {
  Button,
  CheckboxInput,
  ModularTable,
  Tooltip,
} from "@canonical/react-components";
import type { CellProps, Column, Row } from "react-table";
import moment from "moment";
import type { FC } from "react";
import { Suspense, useMemo } from "react";
import type { InstalledSnap } from "../../types";
import SnapDetails from "../SnapDetails";
import classes from "./SnapsList.module.scss";
import { handleCellProps } from "./helpers";

interface SnapsListProps {
  readonly installedSnaps: InstalledSnap[];
  readonly selectedSnapIds: string[];
  readonly setSelectedSnapIds: (items: string[]) => void;
  readonly isSnapsLoading: boolean;
}

const SnapsList: FC<SnapsListProps> = ({
  installedSnaps,
  selectedSnapIds,
  isSnapsLoading,
  setSelectedSnapIds,
}) => {
  const { setSidePanelContent } = useSidePanel();

  const handleSelectionChange = (row: Row<InstalledSnap>) => {
    if (selectedSnapIds.includes(row.original.snap.id)) {
      setSelectedSnapIds(
        selectedSnapIds.filter((id) => id !== row.original.snap.id),
      );
    } else {
      setSelectedSnapIds([...selectedSnapIds, row.original.snap.id]);
    }
  };

  const toggleAll = () => {
    setSelectedSnapIds(
      selectedSnapIds.length !== 0
        ? []
        : installedSnaps.map(({ snap }) => snap.id),
    );
  };

  const handleShowSnapDetails = (snap: InstalledSnap) => {
    setSidePanelContent(
      `${snap.snap.name} details`,
      <Suspense fallback={<LoadingState />}>
        <SnapDetails installedSnap={snap} />
      </Suspense>,
    );
  };

  const columns = useMemo<Column<InstalledSnap>[]>(
    () => [
      {
        Header: (
          <>
            <CheckboxInput
              label={<span className="u-off-screen">Toggle all</span>}
              inline
              onChange={toggleAll}
              checked={
                selectedSnapIds.length === installedSnaps.length &&
                installedSnaps.length !== 0
              }
              indeterminate={
                selectedSnapIds.length !== 0 &&
                selectedSnapIds.length < installedSnaps.length
              }
            />
            <span>Name</span>
          </>
        ),
        accessor: "name",
        Cell: ({ row }: CellProps<InstalledSnap>) => (
          <>
            <CheckboxInput
              label={
                <span className="u-off-screen">{row.original.snap.name}</span>
              }
              inline
              checked={selectedSnapIds.includes(row.original.snap.id)}
              onChange={() => {
                handleSelectionChange(row);
              }}
            />
            <Button
              type="button"
              appearance="link"
              className="u-no-margin--bottom u-no-padding--top"
              onClick={() => {
                handleShowSnapDetails(row.original);
              }}
              aria-label={`Show details of snap ${row.original.snap.name}`}
            >
              {row.original.snap.name}
            </Button>
          </>
        ),
      },
      {
        Header: "channel",
        accessor: "channel",
        Cell: ({ row }: CellProps<InstalledSnap>) => (
          <>{row.original.tracking_channel}</>
        ),
      },
      {
        Header: "held until",
        accessor: "held_until",
        Cell: ({ row }: CellProps<InstalledSnap>) => (
          <>
            {moment(row.original.held_until).isValid() ? (
              <span className={classes.monospace}>
                {" "}
                {moment(row.original.held_until).format(
                  DISPLAY_DATE_TIME_FORMAT,
                )}
              </span>
            ) : (
              <NoData />
            )}
          </>
        ),
      },
      {
        Header: "version",
        accessor: "version",
        Cell: ({ row }: CellProps<InstalledSnap>) => (
          <>
            {row.original.held_until ? (
              <Tooltip message="This snap is held">
                {row.original.version}
              </Tooltip>
            ) : (
              row.original.version
            )}
          </>
        ),
        getCellIcon: ({ row }: CellProps<InstalledSnap>) => {
          if (row.original.held_until) {
            return `pause ${classes.pause}`;
          }
          return null;
        },
      },
      {
        Header: "summary",
        accessor: "summary",
        className: classes.details,
        Cell: ({ row }: CellProps<InstalledSnap>) => (
          <>{row.original.snap.summary}</>
        ),
      },
    ],
    [selectedSnapIds, installedSnaps],
  );

  return (
    <ModularTable
      columns={columns}
      data={installedSnaps}
      getCellProps={handleCellProps}
      emptyMsg={
        isSnapsLoading ? "Loading..." : "No snaps found from the search"
      }
    />
  );
};

export default SnapsList;
