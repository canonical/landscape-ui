import ListTitle from "@/components/layout/ListTitle";
import LoadingState from "@/components/layout/LoadingState";
import NoData from "@/components/layout/NoData";
import ResponsiveTable from "@/components/layout/ResponsiveTable";
import ResponsiveTableSubhead from "@/components/layout/ResponsiveTableSubhead";
import SidePanel from "@/components/layout/SidePanel";
import { ModalTablePagination } from "@/components/layout/TablePagination";
import { useTotalPages } from "@/components/layout/TablePagination/hooks";
import { DISPLAY_DATE_TIME_FORMAT, TSV_EXPORTS_ENABLED } from "@/constants";
import { getExportTitle } from "@/features/exports";
import useSelection from "@/hooks/useSelection";
import date from "@/libs/date";
import { DEFAULT_PAGE_SIZE } from "@/libs/pageParamsManager";
import { CheckboxInput } from "@canonical/react-components";
import { Button } from "@canonical/react-ds-global";
import classNames from "classnames";
import { lazy, useCallback, useMemo, useState, type FC } from "react";
import type { CellProps, Column } from "react-table";
import { useGetActivities } from "../../api";
import { ACTIVITY_STATUSES } from "../../constants";
import type { ActivityCommon } from "../../types";
import ActivitiesHeader from "../ActivitiesHeader";
import type { ActivitiesFilters } from "../ActivitiesHeader/types";
import classes from "./ActivitiesPanelList.module.scss";

const ActivitiesExportForm = lazy(
  async () => import("../ActivitiesExportForm"),
);

const ActivityDetails = lazy(async () => import("../ActivityDetails"));

interface ActivitiesPanelListProps {
  readonly availableActions: Readonly<
    Record<"approve" | "cancel" | "redo", boolean>
  >;
  readonly hiddenColumns: {
    creator: boolean;
  };
  readonly parentId?: number;
  readonly status?: string;
}

const ActivitiesPanelList: FC<ActivitiesPanelListProps> = ({
  availableActions,
  parentId,
  hiddenColumns,
  status = "",
}) => {
  const [filters, setFilters] = useState<ActivitiesFilters>({
    query: "",
    status,
    type: "",
    fromDate: "",
    toDate: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<ActivityCommon>();

  const query = [
    parentId !== undefined ? `parent-id:${parentId}` : "",
    filters.query,
    filters.status && `status:${filters.status}`,
    filters.type && `type:${filters.type}`,
    filters.fromDate && `created-after:${filters.fromDate}`,
    filters.toDate && `created-before:${filters.toDate}`,
  ]
    .filter(Boolean)
    .join(" ");

  const { activities, activitiesCount, isGettingActivities } = useGetActivities(
    {
      query,
      limit: DEFAULT_PAGE_SIZE,
      offset: (currentPage - 1) * DEFAULT_PAGE_SIZE,
    },
    { listenToUrlParams: false },
  );
  const totalPages = useTotalPages(activitiesCount, DEFAULT_PAGE_SIZE);

  const {
    selectedItems: selectedActivities,
    setSelectedItems: setSelectedActivities,
  } = useSelection<ActivityCommon>(activities, isGettingActivities);

  const clearSelection = useCallback(() => {
    setSelectedActivities([]);
    setIsAllSelected(false);
  }, [setSelectedActivities]);

  const closeExport = () => {
    setIsExportOpen(false);
  };

  const closeDetails = () => {
    setSelectedActivity(undefined);
  };

  const selectAll = () => {
    setSelectedActivities([]);
    setIsAllSelected(true);
  };

  const paginate = (page: number) => {
    setCurrentPage(page);
    clearSelection();
  };

  const columns = useMemo<Column<ActivityCommon>[]>(
    () =>
      [
        {
          accessor: "summary",
          Header: (
            <div className={classes.descriptionContent}>
              <CheckboxInput
                label={<span className="u-off-screen">Toggle all</span>}
                inline
                onChange={() => {
                  if (isAllSelected || selectedActivities.length > 0) {
                    clearSelection();
                  } else {
                    setSelectedActivities(activities);
                  }
                }}
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
              <ListTitle>
                <span>Activity</span>
                <span className="u-text--muted">Instance</span>
              </ListTitle>
            </div>
          ),
          Cell: ({ row }: CellProps<ActivityCommon>) => (
            <div className={classes.descriptionContent}>
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
                  if (isAllSelected) {
                    clearSelection();
                    return;
                  }
                  setSelectedActivities(
                    selectedActivities.includes(row.original)
                      ? selectedActivities.filter(
                          (activity) => activity !== row.original,
                        )
                      : [...selectedActivities, row.original],
                  );
                }}
              />
              <ListTitle>
                <Button
                  type="button"
                  variant="link"
                  className={classes.descriptionText}
                  onClick={() => {
                    setSelectedActivity(row.original);
                  }}
                >
                  {row.original.summary}
                </Button>
                <span className={classNames("u-text--muted", classes.cellText)}>
                  {row.original.computer_id ? (
                    row.original.computer_title
                  ) : (
                    <NoData />
                  )}
                </span>
              </ListTitle>
            </div>
          ),
        },
        {
          accessor: "activity_status",
          Header: (
            <ListTitle>
              <span>Status</span>
              <span className="u-text--muted">Completed at</span>
            </ListTitle>
          ),
          Cell: ({ row }: CellProps<ActivityCommon>) => (
            <span className={classes.statusContent}>
              <span className={classes.cellText}>
                {ACTIVITY_STATUSES[row.original.activity_status].label}
              </span>

              <span className={classNames("u-text--muted", classes.cellText)}>
                {row.original.completion_time ? (
                  <span
                    className={classNames("font-monospace", classes.cellText)}
                  >
                    {date(row.original.completion_time).format(
                      DISPLAY_DATE_TIME_FORMAT,
                    )}
                  </span>
                ) : (
                  <NoData />
                )}
              </span>
            </span>
          ),
          getCellIcon: ({
            row: {
              original: { activity_status },
            },
          }: CellProps<ActivityCommon>) =>
            ACTIVITY_STATUSES[activity_status].icon,
        },
        {
          accessor: "creator.name",
          Header: (
            <ListTitle>
              <span>Creator</span>

              <span className="u-text--muted">Created at</span>
            </ListTitle>
          ),
          Cell: ({ row }: CellProps<ActivityCommon>) => (
            <ListTitle>
              <span className={classes.cellText}>
                {row.original.creator?.name ?? <NoData />}
              </span>

              <span
                className={classNames(
                  "font-monospace u-text--muted",
                  classes.cellText,
                )}
              >
                {date(row.original.creation_time).format(
                  DISPLAY_DATE_TIME_FORMAT,
                )}
              </span>
            </ListTitle>
          ),
        },
      ]
        .filter(
          (column) =>
            !hiddenColumns.creator || column.accessor !== "creator.name",
        )
        .filter((column) => !status || column.accessor !== "activity_status"),
    [
      activities,
      clearSelection,
      hiddenColumns,
      isAllSelected,
      selectedActivities,
      setSelectedActivities,
      status,
    ],
  );

  const showSubhead =
    TSV_EXPORTS_ENABLED &&
    (isAllSelected || selectedActivities.length > 0) &&
    activitiesCount !== undefined &&
    activitiesCount > activities.length;

  const subhead = showSubhead ? (
    <tr>
      <td colSpan={columns.length} className="u-no-padding">
        <ResponsiveTableSubhead
          itemName={["activity", "activities"]}
          selectedCount={selectedActivities.length}
          totalCount={activitiesCount}
          canSelectAll
          isAllSelected={isAllSelected}
          onSelectAll={selectAll}
          onClearSelection={clearSelection}
        />
      </td>
    </tr>
  ) : undefined;

  return (
    <>
      <ActivitiesHeader
        alwaysCollapse
        availableFilters={{
          status: !status,
          type: true,
          date: true,
        }}
        searchHelpTerms={{
          id: true,
          parentId: parentId === undefined,
          createdAfter: true,
          createdBefore: true,
          creator: true,
          computer: true,
          type: true,
        }}
        availableActions={availableActions}
        selected={selectedActivities}
        isAllSelected={isAllSelected}
        resetSelectedIds={clearSelection}
        filters={filters}
        onChangeFilters={(values) => {
          setFilters((previous) => ({ ...previous, ...values }));
          setCurrentPage(1);
        }}
        onExport={() => {
          setIsExportOpen(true);
        }}
      />
      {isGettingActivities ? (
        <LoadingState />
      ) : (
        <ResponsiveTable
          emptyMsg="No activities found according to your search parameters."
          columns={columns}
          data={activities}
          minWidth={0}
          subhead={subhead}
          sticky={false}
        />
      )}
      <ModalTablePagination
        current={currentPage}
        max={totalPages}
        onPrev={() => {
          paginate(currentPage - 1);
        }}
        onNext={() => {
          paginate(currentPage + 1);
        }}
      />
      {TSV_EXPORTS_ENABLED && isExportOpen && (
        <SidePanel isOpen onClose={closeExport}>
          <SidePanel.Suspense>
            <SidePanel.Header>
              {getExportTitle({
                isAllSelected,
                selectedCount: selectedActivities.length,
                totalCount: activitiesCount,
                selectionForms: ["activity", "activities"],
              })}
            </SidePanel.Header>
            <SidePanel.Content>
              <ActivitiesExportForm
                exportParams={{ query }}
                selectedActivityIds={
                  isAllSelected
                    ? undefined
                    : selectedActivities.map(({ id }) => id)
                }
                onClose={closeExport}
              />
            </SidePanel.Content>
          </SidePanel.Suspense>
        </SidePanel>
      )}
      {selectedActivity && (
        <SidePanel isOpen onClose={closeDetails}>
          <SidePanel.Suspense>
            <ActivityDetails
              key={selectedActivity.id}
              activityId={selectedActivity.id}
              onClose={closeDetails}
              renderInSidePanel
            />
          </SidePanel.Suspense>
        </SidePanel>
      )}
    </>
  );
};

export default ActivitiesPanelList;
