import SidePanel from "@/components/layout/SidePanel";
import { SidePanelTablePagination } from "@/components/layout/TablePagination";
import { TSV_EXPORTS_ENABLED } from "@/constants";
import { getExportTitle } from "@/features/exports";
import useSelection from "@/hooks/useSelection";
import { DEFAULT_PAGE_SIZE } from "@/libs/pageParamsManager";
import { lazy, useState, type FC } from "react";
import { useGetActivities } from "../../api";
import type { ActivityCommon } from "../../types";
import ActivitiesHeader from "../ActivitiesHeader";
import type { ActivitiesFilters } from "../ActivitiesHeader/types";
import ActivitiesList from "../ActivitiesList";

const ActivitiesExportForm = lazy(
  async () => import("../ActivitiesExportForm"),
);

interface ActivityChildrenProps {
  readonly activityId: number;
  readonly onActivityDetailsOpen: (activity: ActivityCommon) => void;
}

const ActivityChildren: FC<ActivityChildrenProps> = ({
  activityId,
  onActivityDetailsOpen,
}) => {
  const [filters, setFilters] = useState<ActivitiesFilters>({
    query: "",
    status: "",
    type: "",
    fromDate: "",
    toDate: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);
  const [isExportOpen, setIsExportOpen] = useState(false);

  const query = [
    `parent-id:${activityId}`,
    filters.query,
    filters.status ? `status:${filters.status}` : "",
    filters.type ? `type:${filters.type}` : "",
    filters.fromDate ? `created-after:${filters.fromDate}` : "",
    filters.toDate ? `created-before:${filters.toDate}` : "",
  ]
    .filter(Boolean)
    .join(" ");

  const { activities, activitiesCount, isGettingActivities, activitiesError } =
    useGetActivities(
      { query, limit: pageSize, offset: (currentPage - 1) * pageSize },
      { listenToUrlParams: false },
    );
  const {
    selectedItems: selectedActivities,
    setSelectedItems: setSelectedActivities,
  } = useSelection<ActivityCommon>(activities, isGettingActivities);

  const clearSelection = () => {
    setSelectedActivities([]);
  };
  const changePage = (page: number) => {
    setCurrentPage(page);
    clearSelection();
  };

  if (activitiesError) {
    throw activitiesError;
  }

  return (
    <>
      <ActivitiesHeader
        isDetailView
        selected={selectedActivities}
        resetSelectedIds={clearSelection}
        filterControls={{
          values: filters,
          onChange: (values) => {
            setFilters((previous) => ({ ...previous, ...values }));
            setCurrentPage(1);
          },
        }}
        onExport={() => {
          setIsExportOpen(true);
        }}
      />
      <ActivitiesList
        activities={activities}
        activitiesCount={activitiesCount}
        isGettingActivities={isGettingActivities}
        selectedActivities={selectedActivities}
        setSelectedActivities={setSelectedActivities}
        showInstanceColumn
        onActivityDetailsOpen={onActivityDetailsOpen}
      />
      <SidePanelTablePagination
        currentPage={currentPage}
        pageSize={pageSize}
        paginate={changePage}
        setPageSize={setPageSize}
        totalItems={activitiesCount}
        currentItemCount={activities.length}
      />
      {TSV_EXPORTS_ENABLED && isExportOpen && (
        <SidePanel
          isOpen
          size="medium"
          onClose={() => {
            setIsExportOpen(false);
          }}
        >
          <SidePanel.Suspense>
            <SidePanel.Header>
              {getExportTitle({
                isAllSelected: false,
                selectedCount: selectedActivities.length,
                totalCount: activitiesCount,
                selectionForms: ["activity", "activities"],
              })}
            </SidePanel.Header>
            <SidePanel.Content>
              <ActivitiesExportForm
                exportParams={{ query }}
                selectedActivityIds={selectedActivities.map(({ id }) => id)}
                onClose={() => {
                  setIsExportOpen(false);
                }}
              />
            </SidePanel.Content>
          </SidePanel.Suspense>
        </SidePanel>
      )}
    </>
  );
};

export default ActivityChildren;
