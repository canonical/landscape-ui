import LoadingState from "@/components/layout/LoadingState";
import NoData from "@/components/layout/NoData";
import { TablePagination } from "@/components/layout/TablePagination";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import useSidePanel from "@/hooks/useSidePanel";
import { Button, CheckboxInput } from "@canonical/react-components";
import moment from "moment/moment";
import type { FC } from "react";
import { lazy, Suspense, useMemo } from "react";
import { Link } from "react-router";
import type { CellProps, Column } from "react-table";
import { ACTIVITY_STATUSES } from "../../constants";
import { useOpenActivityDetails } from "../../hooks";
import type { ActivityCommon } from "../../types";
import ActivitiesHeader from "../ActivitiesHeader";
import classes from "./Activities.module.scss";
import ResponsiveTable from "@/components/layout/ResponsiveTable";
import { ROUTES } from "@/libs/routes";

const ActivityDetails = lazy(
  async () => import("@/features/activities/components/ActivityDetails"),
);

interface ActivitiesProps {
  readonly activities: ActivityCommon[];
  readonly activitiesCount: number | undefined;
  readonly isGettingActivities: boolean;
  readonly selectedActivities: ActivityCommon[];
  readonly setSelectedActivities: (activities: ActivityCommon[]) => void;
  readonly instanceId?: number;
}

const Activities: FC<ActivitiesProps> = ({
  activities,
  activitiesCount: activityCount,
  instanceId,
  isGettingActivities,
  selectedActivities,
  setSelectedActivities,
}) => {
  const { setSidePanelContent } = useSidePanel();

  const handleActivityDetailsOpen = (activity: ActivityCommon) => {
    setSidePanelContent(
      activity.summary,
      <Suspense fallback={<LoadingState />}>
        <ActivityDetails activityId={activity.id} />
      </Suspense>,
    );
  };

  useOpenActivityDetails(handleActivityDetailsOpen);

  const handleClearSelection = () => {
    setSelectedActivities([]);
  };

  const toggleAll = () => {
    setSelectedActivities(selectedActivities.length !== 0 ? [] : activities);
  };

  const handleToggleActivity = (activity: ActivityCommon) => {
    setSelectedActivities(
      selectedActivities.includes(activity)
        ? selectedActivities.filter(
            (selectedActivity) => selectedActivity !== activity,
          )
        : [...selectedActivities, activity],
    );
  };

  const columns = useMemo<Column<ActivityCommon>[]>(
    () =>
      [
        {
          accessor: "checkbox",
          className: classes.checkbox,
          Header: (
            <CheckboxInput
              label={<span className="u-off-screen">Toggle all</span>}
              inline
              onChange={toggleAll}
              checked={
                activities.length > 0 &&
                selectedActivities.length === activities.length
              }
              indeterminate={
                selectedActivities.length > 0 &&
                selectedActivities.length < activities.length
              }
              disabled={!activities.length}
            />
          ),
          Cell: ({ row }: CellProps<ActivityCommon>) => (
            <CheckboxInput
              label={
                <span className="u-off-screen">{row.original.summary}</span>
              }
              inline
              labelClassName="u-no-margin--bottom u-no-padding--top"
              checked={selectedActivities.includes(row.original)}
              onChange={() => {
                handleToggleActivity(row.original);
              }}
            />
          ),
        },
        {
          accessor: "summary",
          className: classes.description,
          Header: "Description",
          Cell: ({ row }: CellProps<ActivityCommon>) => (
            <Button
              type="button"
              appearance="link"
              className="u-no-margin--bottom u-no-padding--top u-align-text--left"
              onClick={() => {
                handleActivityDetailsOpen(row.original);
              }}
            >
              {row.original.summary}
            </Button>
          ),
        },
        {
          accessor: "activity_status",
          Header: "Status",
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
          accessor: "computer_id",
          Header: "Instance",
          Cell: ({ row }: CellProps<ActivityCommon>) =>
            row.original.computer_id ? (
              <Link
                to={ROUTES.instances.details.single(row.original.computer_id)}
              >
                ID: {row.original.computer_id}
              </Link>
            ) : (
              <NoData />
            ),
        },
        {
          accessor: "creation_time",
          Header: "Created at",
          className: "date-cell",
          Cell: ({ row }: CellProps<ActivityCommon>) => (
            <span className="font-monospace">
              {moment(row.original.creation_time).format(
                DISPLAY_DATE_TIME_FORMAT,
              )}
            </span>
          ),
        },
        {
          accessor: "creator.name",
          Header: "Creator",
          Cell: ({ row }: CellProps<ActivityCommon>) => (
            <>{row.original.creator?.name ?? <NoData />}</>
          ),
        },
      ].filter((col) => !instanceId || col.accessor !== "computer_id"),
    [activities, selectedActivities],
  );

  return (
    <>
      <ActivitiesHeader
        resetSelectedIds={handleClearSelection}
        selected={selectedActivities}
      />
      {isGettingActivities ? (
        <LoadingState />
      ) : (
        <ResponsiveTable
          emptyMsg="No activities found according to your search parameters."
          columns={columns}
          data={activities}
        />
      )}
      <TablePagination
        totalItems={activityCount}
        currentItemCount={activities.length}
        handleClearSelection={handleClearSelection}
      />
    </>
  );
};

export default Activities;
