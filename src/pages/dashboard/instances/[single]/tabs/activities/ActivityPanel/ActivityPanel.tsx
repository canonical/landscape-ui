import LoadingState from "@/components/layout/LoadingState";
import SidePanel from "@/components/layout/SidePanel";
import { TSV_EXPORTS_ENABLED } from "@/constants";
import type { ActivityCommon } from "@/features/activities";
import {
  Activities,
  ActivitiesEmptyState,
  useGetActivities,
} from "@/features/activities";
import { getExportTitle } from "@/features/exports";
import useSetDynamicFilterValidation from "@/hooks/useDynamicFilterValidation";
import usePageParams from "@/hooks/usePageParams";
import useSelection from "@/hooks/useSelection";
import { DEFAULT_PAGE_SIZE } from "@/libs/pageParamsManager/constants";
import { lazy, useCallback, useState, type FC } from "react";

const ActivitiesExportForm = lazy(
  async () => import("@/features/activities/components/ActivitiesExportForm"),
);

interface ActivityPanelProps {
  readonly instanceId?: number;
}

const ActivityPanel: FC<ActivityPanelProps> = ({ instanceId }) => {
  const { activities, activitiesCount, isGettingActivities } = useGetActivities(
    { query: `computer:id:${instanceId}` },
  );

  const {
    activitiesCount: unfilteredActivitiesCount,
    isGettingActivities: isGettingUnfilteredActivities,
  } = useGetActivities(
    {
      limit: DEFAULT_PAGE_SIZE,
      offset: 0,
      query: `computer:id:${instanceId}`,
    },
    { listenToUrlParams: false },
  );

  const {
    selectedItems: selectedActivities,
    setSelectedItems: setSelectedActivities,
  } = useSelection<ActivityCommon>(activities, isGettingActivities);

  const [isAllSelected, setIsAllSelected] = useState(false);

  useSetDynamicFilterValidation(
    "sidePath",
    TSV_EXPORTS_ENABLED ? ["export"] : [],
  );

  const {
    query,
    search,
    status,
    fromDate,
    toDate,
    type,
    lastSidePathSegment,
    popSidePath,
  } = usePageParams();
  const exportQuery = [
    instanceId ? `computer:id:${instanceId}` : "",
    search,
    query,
    status ? `status:${status}` : "",
    fromDate ? `created-after:${fromDate}` : "",
    toDate ? `created-before:${toDate}` : "",
    type ? `type:${type}` : "",
  ]
    .filter(Boolean)
    .join(" ");

  const clearSelection = useCallback(() => {
    setSelectedActivities([]);
    setIsAllSelected(false);
  }, [setSelectedActivities]);

  const selectAll = useCallback(() => {
    setIsAllSelected(true);
    setSelectedActivities([]);
  }, [setSelectedActivities]);

  if (isGettingUnfilteredActivities) {
    return <LoadingState />;
  }

  if (!unfilteredActivitiesCount) {
    return <ActivitiesEmptyState />;
  }

  return (
    <>
      <Activities
        activities={activities}
        activitiesCount={activitiesCount}
        isGettingActivities={isGettingActivities}
        instanceId={instanceId}
        selectedActivities={selectedActivities}
        setSelectedActivities={setSelectedActivities}
        isAllSelected={isAllSelected}
        onSelectAll={selectAll}
        onClearSelection={clearSelection}
      />
      {TSV_EXPORTS_ENABLED && (
        <SidePanel
          isOpen={lastSidePathSegment === "export"}
          onClose={popSidePath}
          size="medium"
        >
          {lastSidePathSegment === "export" && (
            <SidePanel.Suspense key="export">
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
                  exportParams={{ query: exportQuery }}
                  selectedActivityIds={
                    !isAllSelected && selectedActivities.length > 0
                      ? selectedActivities.map((a) => a.id)
                      : undefined
                  }
                />
              </SidePanel.Content>
            </SidePanel.Suspense>
          )}
        </SidePanel>
      )}
    </>
  );
};

export default ActivityPanel;
