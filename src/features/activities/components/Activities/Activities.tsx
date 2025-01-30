import moment from "moment/moment";
import type { FC } from "react";
import { lazy, Suspense, useMemo } from "react";
import type { CellProps, Column } from "react-table";
import {
  Button,
  CheckboxInput,
  ModularTable,
} from "@canonical/react-components";
import LoadingState from "@/components/layout/LoadingState";
import { TablePagination } from "@/components/layout/TablePagination";
import { DISPLAY_DATE_TIME_FORMAT, ROOT_PATH } from "@/constants";
import ActivitiesEmptyState from "../ActivitiesEmptyState";
import ActivitiesHeader from "../ActivitiesHeader";
import { ACTIVITY_STATUSES } from "../../constants";
import { useActivities, useOpenActivityDetails } from "../../hooks";
import useSidePanel from "@/hooks/useSidePanel";
import type { ActivityCommon } from "../../types";
import classes from "./Activities.module.scss";
import usePageParams from "@/hooks/usePageParams";
import NoData from "@/components/layout/NoData";
import { Link } from "react-router";
import { getDateQuery, getStatusQuery, getTypeQuery } from "./helpers";

const ActivityDetails = lazy(
  () => import("@/features/activities/components/ActivityDetails"),
);

interface ActivitiesProps {
  readonly selectedIds: number[];
  readonly setSelectedIds: (ids: number[]) => void;
  readonly instanceId?: number;
}

const Activities: FC<ActivitiesProps> = ({
  instanceId,
  selectedIds,
  setSelectedIds,
}) => {
  const { search, status, fromDate, toDate, type, currentPage, pageSize } =
    usePageParams();
  const { setSidePanelContent } = useSidePanel();
  const { getActivitiesQuery } = useActivities();

  const dateQuery = getDateQuery(fromDate, toDate);
  const typeQuery = getTypeQuery(type);
  const statusQuery = getStatusQuery(status);
  const searchQuery = `${search}${statusQuery}${dateQuery}${typeQuery}`;

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
    setSelectedIds([]);
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
    setSelectedIds(
      selectedIds.length !== 0 ? [] : activities.map(({ id }) => id),
    );
  };

  const handleToggleActivity = (activityId: number) => {
    setSelectedIds(
      selectedIds.includes(activityId)
        ? selectedIds.filter((selectedId) => selectedId !== activityId)
        : [...selectedIds, activityId],
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
                selectedIds.length === activities.length
              }
              indeterminate={
                selectedIds.length > 0 && selectedIds.length < activities.length
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
              checked={selectedIds.includes(row.original.id)}
              onChange={() => {
                handleToggleActivity(row.original.id);
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
              onClick={() => handleActivityDetailsOpen(row.original)}
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
                to={`${ROOT_PATH}instances/${row.original.computer_id}`}
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
    [activities, selectedIds],
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
