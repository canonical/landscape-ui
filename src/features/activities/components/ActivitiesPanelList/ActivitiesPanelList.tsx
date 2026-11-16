import ListTitle from "@/components/layout/ListTitle";
import LoadingState from "@/components/layout/LoadingState";
import NoData from "@/components/layout/NoData";
import ResponsiveTable from "@/components/layout/ResponsiveTable";
import ResponsiveTableSubhead from "@/components/layout/ResponsiveTableSubhead";
import SidePanel from "@/components/layout/SidePanel";
import { SidePanelTablePagination } from "@/components/layout/TablePagination";
import { DISPLAY_DATE_TIME_FORMAT, TSV_EXPORTS_ENABLED } from "@/constants";
import { getExportTitle } from "@/features/exports";
import useSelection from "@/hooks/useSelection";
import date from "@/libs/date";
import { DEFAULT_PAGE_SIZE } from "@/libs/pageParamsManager";
import { ROUTES } from "@/libs/routes";
import { Button, CheckboxInput } from "@canonical/react-components";
import classNames from "classnames";
import { lazy, useCallback, useMemo, useState, type FC } from "react";
import { Link } from "react-router";
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
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);
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
    { query, limit: pageSize, offset: (currentPage - 1) * pageSize },
    { listenToUrlParams: false },
  );

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
          className: "large-cell",
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
                  appearance="link"
                  className={classNames(
                    "u-no-margin--bottom u-no-padding--top u-align-text--left",
                    classes.descriptionText,
                  )}
                  onClick={() => {
                    setSelectedActivity(row.original);
                  }}
                >
                  {row.original.summary}
                </Button>
                {row.original.computer_id ? (
                  <Link
                    to={ROUTES.instances.details.single(
                      row.original.computer_id,
                    )}
                    className="u-text--muted"
                  >
                    {row.original.computer_title}
                  </Link>
                ) : (
                  <span className="u-text--muted">
                    <NoData />
                  </span>
                )}
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
          className: "large-cell",
          Cell: ({ row }: CellProps<ActivityCommon>) => (
            <span className={classes.statusContent}>
              <span>
                {ACTIVITY_STATUSES[row.original.activity_status].label}
              </span>

              <span className="u-text--muted">
                {row.original.completion_time ? (
                  <span className="font-monospace">
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
          className: "large-cell",
          Cell: ({ row }: CellProps<ActivityCommon>) => (
            <ListTitle>
              <span>{row.original.creator?.name ?? <NoData />}</span>

              <span className="font-monospace u-text--muted">
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
      <SidePanelTablePagination
        currentPage={currentPage}
        pageSize={pageSize}
        paginate={paginate}
        setPageSize={setPageSize}
        totalItems={activitiesCount}
        currentItemCount={activities.length}
      />
      {TSV_EXPORTS_ENABLED && isExportOpen && (
        <SidePanel isOpen size="medium" onClose={closeExport}>
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
        <SidePanel isOpen size="medium" onClose={closeDetails}>
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
