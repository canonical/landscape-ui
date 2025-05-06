import LoadingState from "@/components/layout/LoadingState";
import NoData from "@/components/layout/NoData";
import { TablePagination } from "@/components/layout/TablePagination";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import usePageParams from "@/hooks/usePageParams";
import useSidePanel from "@/hooks/useSidePanel";
import {
  Button,
  CheckboxInput,
  ModularTable,
} from "@canonical/react-components";
import moment from "moment/moment";
import type { FC } from "react";
import { lazy, Suspense, useMemo } from "react";
import { Link } from "react-router";
import type { CellProps, Column } from "react-table";
import { ACTIVITY_STATUSES } from "../../constants";
import { useActivities, useOpenActivityDetails } from "../../hooks";
import type { ActivityCommon } from "../../types";
import ActivitiesEmptyState from "../ActivitiesEmptyState";
import ActivitiesHeader from "../ActivitiesHeader";
import classes from "./Activities.module.scss";
import { getDateQuery, getStatusQuery, getTypeQuery } from "./helpers";

const ActivityDetails = lazy(
  async () => import("@/features/activities/components/ActivityDetails"),
);

interface ActivitiesProps {
  readonly selected: ActivityCommon[];
  readonly setSelected: (activities: ActivityCommon[]) => void;
  readonly instanceId?: number;
}

const Activities: FC<ActivitiesProps> = ({
  instanceId,
  selected,
  setSelected,
}) => {
  const {
    query,
    search,
    status,
    fromDate,
    toDate,
    type,
    currentPage,
    pageSize,
  } = usePageParams();
  const { setSidePanelContent } = useSidePanel();
  const { getActivitiesQuery } = useActivities();

  const dateQuery = getDateQuery(fromDate, toDate);
  const typeQuery = getTypeQuery(type);
  const statusQuery = getStatusQuery(status);
  const searchQuery = `${search} ${query}${statusQuery}${dateQuery}${typeQuery}`;

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
    setSelected([]);
  };

  const {
    data: getActivitiesQueryResult,
    isPending: getActivitiesQueryLoading,
  } = getActivitiesQuery({
    query:
      `${instanceId ? `computer:id:${instanceId}` : ""} ${searchQuery ?? ""}`.trim(),
    limit: pageSize,
    offset: (currentPage - 1) * pageSize,
  });

  const activities = useMemo(
    () => getActivitiesQueryResult?.data.results ?? [],
    [getActivitiesQueryResult],
  );

  const toggleAll = () => {
    setSelected(selected.length !== 0 ? [] : activities);
  };

  const handleToggleActivity = (activity: ActivityCommon) => {
    setSelected(
      selected.includes(activity)
        ? selected.filter((selectedActivity) => selectedActivity !== activity)
        : [...selected, activity],
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
                activities.length > 0 && selected.length === activities.length
              }
              indeterminate={
                selected.length > 0 && selected.length < activities.length
              }
            />
          ),
          Cell: ({ row }: CellProps<ActivityCommon>) => (
            <CheckboxInput
              label={
                <span className="u-off-screen">{row.original.summary}</span>
              }
              inline
              labelClassName="u-no-margin--bottom u-no-padding--top"
              checked={selected.includes(row.original)}
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
                className={classes.link}
                to={`/instances/${row.original.computer_id}`}
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
          Cell: ({ row }: CellProps<ActivityCommon>) => (
            <>
              {moment(row.original.creation_time).format(
                DISPLAY_DATE_TIME_FORMAT,
              )}
            </>
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
    [activities, selected],
  );

  return (
    <>
      {!searchQuery &&
        currentPage === 1 &&
        pageSize === 20 &&
        getActivitiesQueryLoading && <LoadingState />}

      {!searchQuery &&
        currentPage === 1 &&
        pageSize === 20 &&
        !getActivitiesQueryLoading &&
        (!getActivitiesQueryResult || !getActivitiesQueryResult.data.count) && (
          <ActivitiesEmptyState />
        )}

      {(!!searchQuery ||
        currentPage !== 1 ||
        pageSize !== 20 ||
        (!getActivitiesQueryLoading &&
          getActivitiesQueryResult &&
          getActivitiesQueryResult.data.count > 0)) && (
        <>
          <ActivitiesHeader resetSelectedIds={handleClearSelection} />
          {getActivitiesQueryLoading ? (
            <LoadingState />
          ) : (
            <ModularTable
              emptyMsg="No activities found according to your search parameters."
              columns={columns}
              data={activities}
            />
          )}
          <TablePagination
            totalItems={getActivitiesQueryResult?.data.count}
            currentItemCount={activities.length}
            handleClearSelection={handleClearSelection}
          />
        </>
      )}
    </>
  );
};

export default Activities;
