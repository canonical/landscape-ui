import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import { DETAILED_UPGRADES_VIEW_ENABLED } from "@/constants";
import { InstancesPageActions } from "@/features/instances";
import useInstances from "@/hooks/useInstances";
import usePageParams from "@/hooks/usePageParams";
import useSelection from "@/hooks/useSelection";
import InstancesContainer from "@/pages/dashboard/instances/InstancesContainer/InstancesContainer";
import type { Instance } from "@/types/Instance";
import { type FC } from "react";
import { getQuery } from "./helpers";

const InstancesPage: FC = () => {
  const { currentPage, pageSize, groupBy, ...filters } = usePageParams();

  const { getInstancesQuery } = useInstances();

  const { data: getInstancesQueryResult, isLoading: isGettingInstances } =
    getInstancesQuery({
      query: getQuery(filters),
      root_only: groupBy === "parent",
      archived_only: filters.status === "archived",
      with_alerts: true,
      with_upgrades: DETAILED_UPGRADES_VIEW_ENABLED,
      limit: pageSize,
      offset: (currentPage - 1) * pageSize,
    });

  const instances = getInstancesQueryResult?.data.results ?? [];

  const {
    selectedItems: selectedInstances,
    setSelectedItems: setSelectedInstances,
  } = useSelection<Instance>(instances, isGettingInstances);

  return (
    <PageMain>
      <PageHeader
        title="Instances"
        actions={[
          <InstancesPageActions
            key="actions"
            isGettingInstances={isGettingInstances}
            selectedInstances={selectedInstances}
          />,
        ]}
        sticky
      />
      <PageContent>
        <InstancesContainer
          instanceCount={getInstancesQueryResult?.data.count}
          instances={instances}
          isGettingInstances={isGettingInstances}
          selectedInstances={selectedInstances}
          setSelectedInstances={setSelectedInstances}
        />
      </PageContent>
    </PageMain>
  );
};

export default InstancesPage;
