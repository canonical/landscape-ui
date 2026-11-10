import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import SidePanel from "@/components/layout/SidePanel";
import type { ActivityCommon } from "@/features/activities";
import {
  ActivityDetails,
  ActivitiesContainer,
  useGetActivityParents,
  ActivitiesList,
} from "@/features/activities";
import useSetDynamicFilterValidation from "@/hooks/useDynamicFilterValidation";
import usePageParams from "@/hooks/usePageParams";
import useSelection from "@/hooks/useSelection";
import { DEFAULT_PAGE_SIZE } from "@/libs/pageParamsManager/constants";
import { useCallback, useState, type FC } from "react";

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

  useSetDynamicFilterValidation("sidePath", ["activity"]);

  const { name, lastSidePathSegment, setPageParams, popSidePathUntilClear } =
    usePageParams();

  const clearSelection = useCallback(() => {
    setSelectedActivities([]);
    setIsAllSelected(false);
  }, [setSelectedActivities]);

  const selectAll = useCallback(() => {
    setIsAllSelected(true);
    setSelectedActivities([]);
  }, [setSelectedActivities]);

  const handleActivityDetailsOpen = useCallback(
    (activity: ActivityCommon) => {
      setPageParams({
        sidePath: ["activity"],
        name: String(activity.id),
      });
    },
    [setPageParams],
  );

  return (
    <PageMain>
      <PageHeader title="Activities" />
      <PageContent hasTable>
        <ActivitiesContainer
          activities={activities}
          activitiesCount={activitiesCount}
          isGettingUnfilteredActivities={isGettingUnfilteredActivities}
          unfilteredActivitiesCount={unfilteredActivitiesCount}
          selectedActivities={selectedActivities}
          setSelectedActivities={setSelectedActivities}
          isAllSelected={isAllSelected}
          onClearSelection={clearSelection}
        >
          <ActivitiesList
            header="Activity group"
            activities={activities}
            activitiesCount={activitiesCount}
            isGettingActivities={isGettingActivities}
            selectionEnabled={false}
            selectedActivities={selectedActivities}
            setSelectedActivities={setSelectedActivities}
            isAllSelected={isAllSelected}
            onSelectAll={selectAll}
            onClearSelection={clearSelection}
            onActivityDetailsOpen={handleActivityDetailsOpen}
          />
        </ActivitiesContainer>
      </PageContent>

      <SidePanel
        isOpen={lastSidePathSegment === "activity"}
        onClose={popSidePathUntilClear}
        size="large"
      >
        <SidePanel.Suspense key={`activity-${name}`}>
          <ActivityDetails
            activityId={Number(name)}
            size="large"
            onClose={popSidePathUntilClear}
            renderInSidePanel
          />
        </SidePanel.Suspense>
      </SidePanel>
    </PageMain>
  );
};

export default ActivitiesPage;
