import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import SidePanel from "@/components/layout/SidePanel";
import { TSV_EXPORTS_ENABLED } from "@/constants";
import type { ActivityCommon } from "@/features/activities";
import { ActivitiesActions, ActivitiesContainer } from "@/features/activities";
import { useGetActivityParents } from "@/features/activities";
import { getExportTitle } from "@/features/exports";
import useSetDynamicFilterValidation from "@/hooks/useDynamicFilterValidation";
import usePageParams from "@/hooks/usePageParams";
import useSelection from "@/hooks/useSelection";
import { DEFAULT_PAGE_SIZE } from "@/libs/pageParamsManager/constants";
import { lazy, useCallback, useState, type FC } from "react";

const ActivitiesExportForm = lazy(
  async () => import("@/features/activities/components/ActivitiesExportForm"),
);

const ActivitiesPage: FC = () => {
  const { activities, activitiesCount, isGettingActivities } =
    useGetActivityParents();

  const {
    activitiesCount: unfilteredActivitiesCount,
    isGettingActivities: isGettingUnfilteredActivities,
  } = useGetActivityParents(
    {
      limit: DEFAULT_PAGE_SIZE,
      offset: 0,
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

  return (
    <PageMain>
      <PageHeader
        title="Activities"
        actions={
          TSV_EXPORTS_ENABLED && unfilteredActivitiesCount
            ? [
                <ActivitiesActions
                  selected={selectedActivities}
                  key="activities-actions"
                  isAllSelected={isAllSelected}
                  exportOnly
                />,
              ]
            : undefined
        }
      />
      <PageContent hasTable>
        <ActivitiesContainer
          activities={activities}
          activitiesCount={activitiesCount}
          isGettingActivities={isGettingActivities}
          isGettingUnfilteredActivities={isGettingUnfilteredActivities}
          unfilteredActivitiesCount={unfilteredActivitiesCount}
          selectedActivities={selectedActivities}
          setSelectedActivities={
            TSV_EXPORTS_ENABLED ? setSelectedActivities : undefined
          }
          isAllSelected={isAllSelected}
          onSelectAll={selectAll}
          onClearSelection={clearSelection}
        />
      </PageContent>

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
    </PageMain>
  );
};

export default ActivitiesPage;
