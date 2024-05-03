import moment from "moment/moment";
import { FC, lazy, Suspense, useMemo, useState } from "react";
import { CellProps, Column } from "react-table";
import {
  Button,
  CheckboxInput,
  ModularTable,
} from "@canonical/react-components";
import LoadingState from "@/components/layout/LoadingState";
import TablePagination from "@/components/layout/TablePagination";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import ActivitiesEmptyState from "@/features/activities/ActivitiesEmptyState";
import ActivitiesHeader from "@/features/activities/ActivitiesHeader";
import { ACTIVITY_STATUSES } from "@/features/activities/constants";
import {
  useActivities,
  useOpenActivityDetails,
} from "@/features/activities/hooks";
import useSidePanel from "@/hooks/useSidePanel";
import { ActivityCommon } from "@/features/activities/types";
import classes from "./Activities.module.scss";

const ActivityDetails = lazy(
  () => import("@/features/activities/ActivityDetails"),
);

interface ActivitiesProps {
  instanceId?: number;
}

const Activities: FC<ActivitiesProps> = ({ instanceId }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const { setSidePanelContent } = useSidePanel();
  const { getActivitiesQuery } = useActivities();

  const handleActivityDetailsOpen = (activity: ActivityCommon) => {
    setSidePanelContent(
      activity.summary,
      <Suspense fallback={<LoadingState />}>
        <ActivityDetails activityId={activity.id} />
      </Suspense>,
    );
  };

  useOpenActivityDetails(handleActivityDetailsOpen);

  const handlePaginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    setSelectedIds([]);
  };

  const handlePageSizeChange = (itemsNumber: number) => {
    setPageSize(itemsNumber);
    handlePaginate(1);
  };

  const {
    data: getActivitiesQueryResult,
    isLoading: getActivitiesQueryLoading,
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
    setSelectedIds((prevState) =>
      prevState.length ? [] : activities.map(({ id }) => id),
    );
  };

  const handleToggleActivity = (activityId: number) => {
    setSelectedIds((prevState) =>
      prevState.includes(activityId)
        ? prevState.filter((selectedId) => selectedId !== activityId)
        : [...prevState, activityId],
    );
  };

  const columns = useMemo<Column<ActivityCommon>[]>(
    () => [
      {
        accessor: "checkbox",
        className: classes.checkbox,
        Header: (
          <CheckboxInput
            label={<span className="u-off-screen">Toggle all</span>}
            inline
            onChange={toggleAll}
            checked={
              activities.length > 0 && selectedIds.length === activities.length
            }
            indeterminate={
              selectedIds.length > 0 && selectedIds.length < activities.length
            }
          />
        ),
        Cell: ({ row }: CellProps<ActivityCommon>) => (
          <CheckboxInput
            label={<span className="u-off-screen">{row.original.summary}</span>}
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
          <>{row.original.creator?.name ?? "-"}</>
        ),
      },
    ],
    [activities, selectedIds],
  );

  return (
    <>
      {!searchQuery &&
        currentPage === 1 &&
        pageSize === 50 &&
        getActivitiesQueryLoading && <LoadingState />}

      {!searchQuery &&
        currentPage === 1 &&
        pageSize === 50 &&
        !getActivitiesQueryLoading &&
        (!getActivitiesQueryResult || !getActivitiesQueryResult.data.count) && (
          <ActivitiesEmptyState />
        )}

      {(!!searchQuery ||
        currentPage !== 1 ||
        pageSize !== 50 ||
        (!getActivitiesQueryLoading &&
          getActivitiesQueryResult &&
          getActivitiesQueryResult.data.count > 0)) && (
        <>
          <ActivitiesHeader
            resetPage={() => setCurrentPage(1)}
            resetSelectedIds={() => setSelectedIds([])}
            selectedIds={selectedIds}
            setSearchQuery={(newSearchQuery) => {
              setSearchQuery(newSearchQuery);
            }}
          />
          <ModularTable columns={columns} data={activities} />
          <TablePagination
            currentPage={currentPage}
            totalItems={getActivitiesQueryResult?.data.count}
            paginate={handlePaginate}
            pageSize={pageSize}
            setPageSize={handlePageSizeChange}
            currentItemCount={activities.length}
          />
        </>
      )}
    </>
  );
};

export default Activities;
