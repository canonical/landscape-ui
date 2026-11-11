import LoadingState from "@/components/layout/LoadingState";
import NoData from "@/components/layout/NoData";
import ResponsiveTable from "@/components/layout/ResponsiveTable";
import { BREAKPOINT_PX, DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import type { ActivityCommon } from "@/features/activities";
import { ACTIVITY_STATUSES } from "@/features/activities";
import useSidePanel from "@/hooks/useSidePanel";
import date from "@/libs/date";
import { Button } from "@canonical/react-components";
import type { FC } from "react";
import { lazy, Suspense, useCallback, useMemo } from "react";
import type { CellProps, Column } from "react-table";
import { useMediaQuery } from "usehooks-ts";
import classes from "./SupportInstanceActivitiesList.module.scss";

const SupportActivityDetails = lazy(
  async () => import("./SupportActivityDetails"),
);

const DateCell: FC<{ readonly value: string | null }> = ({ value }) =>
  value ? (
    <span className="font-monospace">
      {date(value).format(DISPLAY_DATE_TIME_FORMAT)}
    </span>
  ) : (
    <NoData />
  );

interface SupportInstanceActivitiesListProps {
  /** The account the activities belong to. */
  readonly name: string;
  readonly activities: ActivityCommon[];
}

/** An instance's activities, read-only: a description opens its details. */
const SupportInstanceActivitiesList: FC<SupportInstanceActivitiesListProps> = ({
  name,
  activities,
}) => {
  const { setSidePanelContent } = useSidePanel();
  const isMedium = useMediaQuery(`(max-width: ${BREAKPOINT_PX.md}px)`);

  const openDetails = useCallback(
    ({ id, summary }: ActivityCommon) => {
      setSidePanelContent(
        summary,
        <Suspense fallback={<LoadingState />}>
          <SupportActivityDetails name={name} activityId={id} />
        </Suspense>,
      );
    },
    [name, setSidePanelContent],
  );

  const columns = useMemo<Column<ActivityCommon>[]>(
    () => [
      {
        accessor: "summary",
        Header: "Description",
        className: isMedium ? undefined : classes.description,
        Cell: ({ row: { original } }: CellProps<ActivityCommon>) => (
          <Button
            type="button"
            appearance="link"
            className="u-no-margin--bottom u-no-padding--top u-align-text--left"
            onClick={() => {
              openDetails(original);
            }}
          >
            {original.summary}
          </Button>
        ),
      },
      {
        accessor: "activity_status",
        Header: "Status",
        className: "medium-cell",
        Cell: ({
          row: {
            original: { activity_status },
          },
        }: CellProps<ActivityCommon>) =>
          ACTIVITY_STATUSES[activity_status].label,
        getCellIcon: ({
          row: {
            original: { activity_status },
          },
        }: CellProps<ActivityCommon>) =>
          ACTIVITY_STATUSES[activity_status].icon,
      },
      {
        accessor: "creation_time",
        Header: "Created at",
        className: "large-cell",
        Cell: ({ row: { original } }: CellProps<ActivityCommon>) => (
          <DateCell value={original.creation_time} />
        ),
      },
      {
        accessor: "completion_time",
        Header: "Completed at",
        className: "large-cell",
        Cell: ({ row: { original } }: CellProps<ActivityCommon>) => (
          <DateCell value={original.completion_time} />
        ),
      },
      {
        accessor: "creator.name",
        Header: "Creator",
        className: "medium-cell",
        Cell: ({ row: { original } }: CellProps<ActivityCommon>) =>
          original.creator?.name ?? <NoData />,
      },
    ],
    [isMedium, openDetails],
  );

  return (
    <ResponsiveTable
      emptyMsg="No activities found according to your search parameters."
      columns={columns}
      data={activities}
      minWidth={1400}
    />
  );
};

export default SupportInstanceActivitiesList;
