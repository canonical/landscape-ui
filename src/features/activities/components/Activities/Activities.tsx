import LoadingState from "@/components/layout/LoadingState";
import NoData from "@/components/layout/NoData";
import ResponsiveTable from "@/components/layout/ResponsiveTable";
import { TablePagination } from "@/components/layout/TablePagination";
import { BREAKPOINT_PX, DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import { ROUTES } from "@/libs/routes";
import { Button, CheckboxInput } from "@canonical/react-components";
import date from "@/libs/date";
import type { FC } from "react";
import { useCallback, useMemo } from "react";
import { Link } from "react-router";
import type { CellProps, Column } from "react-table";
import { useMediaQuery } from "usehooks-ts";
import { ACTIVITY_STATUSES } from "../../constants";
import {
  useOpenActivityDetails,
  useOpenActivityDetailsPanel,
} from "../../hooks";
import type { ActivityCommon } from "../../types";
import ActivitiesHeader from "../ActivitiesHeader";
import classes from "./Activities.module.scss";

interface ActivitiesProps {
  readonly activities: ActivityCommon[];
  readonly activitiesCount: number | undefined;
  readonly isGettingActivities: boolean;
  readonly selectedActivities: ActivityCommon[];
  readonly setSelectedActivities: (activities: ActivityCommon[]) => void;
  readonly instanceId?: number;
  readonly isAllSelected?: boolean;
  readonly onSelectAll?: () => void;
  readonly onClearSelection?: () => void;
}

const Activities: FC<ActivitiesProps> = ({
  activities,
  activitiesCount: activityCount,
  instanceId,
  isGettingActivities,
  selectedActivities,
  setSelectedActivities,
  isAllSelected = false,
  onSelectAll,
  onClearSelection,
}) => {
  const handleActivityDetailsOpen = useOpenActivityDetailsPanel();

  const isMedium = useMediaQuery(`(max-width: ${BREAKPOINT_PX.md}px)`);

  useOpenActivityDetails(handleActivityDetailsOpen);

  const handleClearSelection = useCallback(() => {
    if (onClearSelection) {
      onClearSelection();
    } else {
      setSelectedActivities([]);
    }
  }, [setSelectedActivities, onClearSelection]);

  const toggleAll = useCallback(() => {
    if (isAllSelected || selectedActivities.length !== 0) {
      handleClearSelection();
    } else {
      setSelectedActivities(activities);
    }
  }, [
    activities,
    isAllSelected,
    selectedActivities,
    setSelectedActivities,
    handleClearSelection,
  ]);

  const handleToggleActivity = useCallback(
    (activity: ActivityCommon) => {
      if (isAllSelected) {
        handleClearSelection();
        return;
      }
      setSelectedActivities(
        selectedActivities.includes(activity)
          ? selectedActivities.filter(
              (selectedActivity) => selectedActivity !== activity,
            )
          : [...selectedActivities, activity],
      );
    },
    [
      isAllSelected,
      selectedActivities,
      setSelectedActivities,
      handleClearSelection,
    ],
  );

  const columns = useMemo<Column<ActivityCommon>[]>(
    () =>
      [
        {
          accessor: "summary",
          className: isMedium ? undefined : classes.description,
          Header: (
            <>
              <CheckboxInput
                label={<span className="u-off-screen">Toggle all</span>}
                inline
                onChange={toggleAll}
                checked={
                  isAllSelected ||
                  (activities.length > 0 &&
                    selectedActivities.length === activities.length)
                }
                indeterminate={
                  !isAllSelected &&
                  selectedActivities.length > 0 &&
                  selectedActivities.length < activities.length
                }
                disabled={!activities.length}
              />
              Description
            </>
          ),
          Cell: ({ row }: CellProps<ActivityCommon>) => (
            <>
              <CheckboxInput
                label={
                  <span className="u-off-screen">{row.original.summary}</span>
                }
                inline
                labelClassName="u-no-margin--bottom u-no-padding--top"
                checked={
                  isAllSelected || selectedActivities.includes(row.original)
                }
                onChange={() => {
                  handleToggleActivity(row.original);
                }}
              />
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
            </>
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
          className: "large-cell",
          Cell: ({ row }: CellProps<ActivityCommon>) => (
            <span className="font-monospace">
              {date(row.original.creation_time).format(
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
    [
      activities,
      isAllSelected,
      selectedActivities,
      toggleAll,
      handleToggleActivity,
      handleActivityDetailsOpen,
      instanceId,
      isMedium,
    ],
  );

  const showSubhead =
    onSelectAll &&
    (isAllSelected || selectedActivities.length > 0) &&
    activityCount !== undefined &&
    activityCount > activities.length;

  const subhead = showSubhead ? (
    <tr>
      <td colSpan={columns.length} className="u-no-padding">
        <div className={classes.subhead}>
          <span>
            {isAllSelected
              ? `All ${activityCount} activities selected`
              : `${selectedActivities.length} of ${activityCount} activities selected`}
          </span>
          <div className={classes.buttons}>
            {!isAllSelected && onSelectAll && (
              <Button
                className="u-no-padding u-no-margin"
                appearance="link"
                onClick={onSelectAll}
              >
                Select all {activityCount} activities
              </Button>
            )}
            {onClearSelection && (
              <Button
                className="u-no-padding u-no-margin"
                appearance="link"
                onClick={onClearSelection}
              >
                Clear selection
              </Button>
            )}
          </div>
        </div>
      </td>
    </tr>
  ) : undefined;

  return (
    <>
      <ActivitiesHeader
        resetSelectedIds={handleClearSelection}
        selected={selectedActivities}
        isAllSelected={isAllSelected}
      />
      {isGettingActivities ? (
        <LoadingState />
      ) : (
        <ResponsiveTable
          emptyMsg="No activities found according to your search parameters."
          columns={columns}
          data={activities}
          minWidth={1150}
          subhead={subhead}
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
