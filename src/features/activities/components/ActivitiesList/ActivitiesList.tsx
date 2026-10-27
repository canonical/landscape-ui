import LoadingState from "@/components/layout/LoadingState";
import NoData from "@/components/layout/NoData";
import ResponsiveTable from "@/components/layout/ResponsiveTable";
import { BREAKPOINT_PX, DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import { Button, CheckboxInput } from "@canonical/react-components";
import date from "@/libs/date";
import { ROUTES } from "@/libs/routes";
import type { FC, ReactNode } from "react";
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
import classes from "../Activities/Activities.module.scss";

interface ActivitiesListProps {
  readonly activities: ActivityCommon[];
  readonly activitiesCount?: number;
  readonly isGettingActivities?: boolean;
  readonly selectedActivities?: ActivityCommon[];
  readonly setSelectedActivities?: (activities: ActivityCommon[]) => void;
  readonly instanceId?: number;
  readonly isAllSelected?: boolean;
  readonly onSelectAll?: () => void;
  readonly onClearSelection?: () => void;
  readonly showInstanceColumn?: boolean;
  readonly isActivityGroup?: boolean;
  readonly onActivityDetailsOpen?: (activity: ActivityCommon) => void;
}

const ActivitiesList: FC<ActivitiesListProps> = ({
  activities,
  activitiesCount,
  isGettingActivities = false,
  selectedActivities = [],
  setSelectedActivities,
  instanceId,
  isAllSelected = false,
  onSelectAll,
  onClearSelection,
  showInstanceColumn = false,
  isActivityGroup = false,
  onActivityDetailsOpen,
}) => {
  const openActivityDetailsPanel = useOpenActivityDetailsPanel();
  const handleActivityDetailsOpen = useCallback(
    (activity: ActivityCommon) => {
      openActivityDetailsPanel(activity, {
        hideInstanceField: instanceId !== undefined,
        size: isActivityGroup ? "large" : "small",
      });
    },
    [openActivityDetailsPanel, instanceId, isActivityGroup],
  );
  const isMedium = useMediaQuery(`(max-width: ${BREAKPOINT_PX.md}px)`);
  const isSelectionEnabled = setSelectedActivities !== undefined;

  useOpenActivityDetails(handleActivityDetailsOpen);

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
        className: isMedium ? undefined : classes.description,
        Header: (
          <>
            {isSelectionEnabled && (
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
            <span>{isActivityGroup ? "Activity group" : "Activity"}</span>
          </>
        ),
        Cell: ({ row }: CellProps<ActivityCommon>) => (
          <div className={classes.descriptionContent}>
            {isSelectionEnabled && (
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
              appearance="link"
              className={`u-no-margin--bottom u-no-padding--top u-align-text--left ${classes.descriptionText}`}
              onClick={() => {
                if (onActivityDetailsOpen) {
                  onActivityDetailsOpen(row.original);
                  return;
                }
                handleActivityDetailsOpen(row.original);
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
      ...(showInstanceColumn
        ? [
            {
              accessor: "computer_id" as const,
              Header: "Instance",
              className: "large-cell",
              Cell: ({ row }: CellProps<ActivityCommon>): ReactNode =>
                row.original.computer_id ? (
                  <Link
                    to={ROUTES.instances.details.single(
                      row.original.computer_id,
                    )}
                  >
                    {row.original.computer_title}
                  </Link>
                ) : (
                  <NoData />
                ),
            },
          ]
        : []),
      {
        accessor: "creation_time",
        Header: "Created at",
        className: "medium-cell",
        Cell: ({ row }: CellProps<ActivityCommon>) => (
          <span className="font-monospace">
            {date(row.original.creation_time).format(DISPLAY_DATE_TIME_FORMAT)}
          </span>
        ),
      },
      {
        accessor: "completion_time",
        Header: "Completed at",
        className: "medium-cell",
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
      handleActivityDetailsOpen,
      onActivityDetailsOpen,
      handleToggleActivity,
      isAllSelected,
      isMedium,
      isSelectionEnabled,
      selectedActivities,
      showInstanceColumn,
      isActivityGroup,
      toggleAll,
    ],
  );

  const showSubhead =
    onSelectAll &&
    (isAllSelected || selectedActivities.length > 0) &&
    activitiesCount !== undefined &&
    activitiesCount > activities.length;

  const subhead = showSubhead ? (
    <tr>
      <td colSpan={columns.length} className="u-no-padding">
        <div className={classes.subhead}>
          <span>
            {isAllSelected
              ? `All ${activitiesCount} activities selected`
              : `${selectedActivities.length} of ${activitiesCount} activities selected`}
          </span>
          <div className={classes.buttons}>
            {!isAllSelected && onSelectAll && (
              <Button
                className="u-no-padding u-no-margin"
                appearance="link"
                onClick={onSelectAll}
              >
                Select all {activitiesCount} activities
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
