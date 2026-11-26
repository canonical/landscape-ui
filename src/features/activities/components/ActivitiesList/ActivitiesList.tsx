import LoadingState from "@/components/layout/LoadingState";
import NoData from "@/components/layout/NoData";
import ResponsiveTable from "@/components/layout/ResponsiveTable";
import { DISPLAY_DATE_TIME_FORMAT, TSV_EXPORTS_ENABLED } from "@/constants";
import { CheckboxInput } from "@canonical/react-components";
import { Button } from "@canonical/react-ds-global";
import date from "@/libs/date";
import type { FC, ReactNode } from "react";
import { useCallback, useMemo } from "react";
import type { CellProps, Column } from "react-table";
import { ACTIVITY_STATUSES } from "../../constants";
import type { ActivityCommon } from "../../types";
import classes from "./ActivitiesList.module.scss";

interface ActivitiesListProps {
  readonly activities: ActivityCommon[];
  readonly onActivityDetailsOpen: (activity: ActivityCommon) => void;
  readonly activitiesCount: number | undefined;
  readonly isGettingActivities: boolean;
  readonly header: ReactNode;
  readonly selectionEnabled: boolean;
  readonly selectedActivities?: ActivityCommon[];
  readonly setSelectedActivities?: (activities: ActivityCommon[]) => void;
  readonly isAllSelected?: boolean;
  readonly onSelectAll?: () => void;
  readonly onClearSelection?: () => void;
}

const ActivitiesList: FC<ActivitiesListProps> = ({
  activities,
  onActivityDetailsOpen,
  activitiesCount: activityCount,
  isGettingActivities,
  header,
  selectionEnabled,
  selectedActivities = [],
  setSelectedActivities,
  isAllSelected = false,
  onSelectAll,
  onClearSelection,
}) => {
  const handleClearSelection = useCallback(() => {
    if (onClearSelection) {
      onClearSelection();
    } else {
      setSelectedActivities?.([]);
    }
  }, [setSelectedActivities, onClearSelection]);

  const toggleAll = useCallback(() => {
    if (isAllSelected || selectedActivities.length !== 0) {
      handleClearSelection();
    } else {
      setSelectedActivities?.(activities);
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
      setSelectedActivities?.(
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
    () => [
      {
        accessor: "summary",
        className: "large-cell",
        Header: (
          <>
            {selectionEnabled && (
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
            )}
            <span>{header}</span>
          </>
        ),
        Cell: ({ row }: CellProps<ActivityCommon>) => (
          <div className={classes.descriptionContent}>
            {selectionEnabled && (
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
            )}
            <Button
              type="button"
              variant="link"
              className={classes.descriptionText}
              onClick={() => {
                onActivityDetailsOpen(row.original);
              }}
            >
              {row.original.summary}
            </Button>
          </div>
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
        Cell: ({ row }: CellProps<ActivityCommon>) => (
          <span className="font-monospace">
            {date(row.original.creation_time).format(DISPLAY_DATE_TIME_FORMAT)}
          </span>
        ),
      },
      {
        accessor: "completion_time",
        Header: "Completed at",
        className: "large-cell",
        Cell: ({ row }: CellProps<ActivityCommon>) =>
          row.original.completion_time ? (
            <span className="font-monospace">
              {date(row.original.completion_time).format(
                DISPLAY_DATE_TIME_FORMAT,
              )}
            </span>
          ) : (
            <NoData />
          ),
      },
      {
        accessor: "creator.name",
        Header: "Creator",
        className: "medium-cell",
        Cell: ({ row }: CellProps<ActivityCommon>) => (
          <>{row.original.creator?.name ?? <NoData />}</>
        ),
      },
    ],
    [
      activities,
      header,
      selectionEnabled,
      isAllSelected,
      selectedActivities,
      toggleAll,
      handleToggleActivity,
      onActivityDetailsOpen,
    ],
  );

  const showSubhead =
    TSV_EXPORTS_ENABLED &&
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
              <Button type="button" variant="link" onClick={onSelectAll}>
                Select all {activityCount} activities
              </Button>
            )}
            {onClearSelection && (
              <Button type="button" variant="link" onClick={onClearSelection}>
                Clear selection
              </Button>
            )}
          </div>
        </div>
      </td>
    </tr>
  ) : undefined;

  return isGettingActivities ? (
    <LoadingState />
  ) : (
    <ResponsiveTable
      emptyMsg="No activities found according to your search parameters."
      columns={columns}
      data={activities}
      minWidth={1400}
      subhead={subhead}
    />
  );
};

export default ActivitiesList;
