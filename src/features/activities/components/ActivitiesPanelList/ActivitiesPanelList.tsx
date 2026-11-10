import SidePanel from "@/components/layout/SidePanel";
import { SidePanelTablePagination } from "@/components/layout/TablePagination";
import { TSV_EXPORTS_ENABLED } from "@/constants";
import { getExportTitle } from "@/features/exports";
import useSelection from "@/hooks/useSelection";
import { DEFAULT_PAGE_SIZE } from "@/libs/pageParamsManager";
import { lazy, useState, type FC } from "react";
import { useGetActivities } from "../../api";
import type { ActivityCommon } from "../../types";
import ActivitiesEmptyState from "../ActivitiesEmptyState";
import ActivitiesHeader from "../ActivitiesHeader";
import type { ActivitiesFilters } from "../ActivitiesHeader/types";
import ActivitiesList from "../ActivitiesList";

const ActivitiesExportForm = lazy(
  async () => import("../ActivitiesExportForm"),
);

const ActivityDetails = lazy(async () => import("../ActivityDetails"));

interface ActivitiesPanelListProps {
  readonly availableActions: Readonly<
    Record<"approve" | "cancel" | "redo", boolean>
  >;
  readonly parentId?: number;
  readonly status?: string;
  readonly size?: "small" | "medium" | "large";
}

const ActivitiesPanelList: FC<ActivitiesPanelListProps> = ({
  availableActions,
  parentId,
  status = "",
  size,
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

  const clearSelection = () => {
    setSelectedActivities([]);
    setIsAllSelected(false);
  };

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

  if (
    !isGettingActivities &&
    activitiesCount === 0 &&
    !Object.values(filters).some(Boolean)
  ) {
    return <ActivitiesEmptyState />;
  }

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
      <ActivitiesList
        header="Activity"
        activities={activities}
        activitiesCount={activitiesCount}
        isGettingActivities={isGettingActivities}
        selectionEnabled
        selectedActivities={selectedActivities}
        setSelectedActivities={setSelectedActivities}
        isAllSelected={isAllSelected}
        onSelectAll={selectAll}
        onClearSelection={clearSelection}
        showInstanceColumn
        onActivityDetailsOpen={setSelectedActivity}
      />
      <SidePanelTablePagination
        currentPage={currentPage}
        pageSize={pageSize}
        paginate={paginate}
        setPageSize={setPageSize}
        totalItems={activitiesCount}
        currentItemCount={activities.length}
      />
      {TSV_EXPORTS_ENABLED && isExportOpen && (
        <SidePanel
          isOpen
          size={size === "small" ? "medium" : size}
          onClose={closeExport}
        >
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
        <SidePanel isOpen size={size} onClose={closeDetails}>
          <SidePanel.Suspense>
            <ActivityDetails
              key={selectedActivity.id}
              activityId={selectedActivity.id}
              size={size}
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
