import { FC, lazy, Suspense, useMemo, useState } from "react";
import useDebug from "../../hooks/useDebug";
import useActivities from "../../hooks/useActivities";
import { CellProps, Column } from "react-table";
import { Activity, ActivityCommon } from "../../types/Activity";
import LoadingState from "../layout/LoadingState";
import {
  Button,
  CheckboxInput,
  ModularTable,
} from "@canonical/react-components";
import moment from "moment/moment";
import { DISPLAY_DATE_TIME_FORMAT } from "../../constants";
import useSidePanel from "../../hooks/useSidePanel";
import ActivitiesHeader from "./ActivitiesHeader";
import TablePagination from "../layout/TablePagination";
import { ACTIVITY_STATUSES } from "./_data";
import classes from "./Activities.module.scss";

const ActivityDetails = lazy(() => import("./ActivityDetails"));

interface ActivitiesProps {
  query?: string;
}

const Activities: FC<ActivitiesProps> = ({ query = "" }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const debug = useDebug();
  const { setSidePanelContent } = useSidePanel();
  const { getActivitiesQuery } = useActivities();

  const handlePaginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    setSelectedIds([]);
  };

  const handlePageSizeChange = (itemsNumber: number) => {
    setPageSize(itemsNumber);
    handlePaginate(1);
  };

  const { data: getActivitiesQueryResult, error: getActivitiesQueryError } =
    getActivitiesQuery({
      query: `${query} ${searchQuery ?? ""}`.trim(),
      limit: pageSize,
      offset: (currentPage - 1) * pageSize,
    });

  if (getActivitiesQueryError) {
    debug(getActivitiesQueryError);
  }

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

  const handleActivityClick = (activity: ActivityCommon) => {
    setSidePanelContent(
      activity.summary,
      <Suspense fallback={<LoadingState />}>
        <ActivityDetails activity={activity as Activity} />
      </Suspense>,
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
            onClick={() => handleActivityClick(row.original)}
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
      },
    ],
    [activities, selectedIds],
  );

  return (
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
        itemLabels={{ singular: "activity", plural: "activities" }}
      />
    </>
  );
};

export default Activities;
