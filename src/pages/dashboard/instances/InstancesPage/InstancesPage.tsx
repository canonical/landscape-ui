import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import { DETAILED_UPGRADES_VIEW_ENABLED } from "@/constants";
import { InstancesPageActions, useGetInstances } from "@/features/instances";
import usePageParams from "@/hooks/usePageParams";
import useSelection from "@/hooks/useSelection";
import InstancesContainer from "@/pages/dashboard/instances/InstancesContainer/InstancesContainer";
import type { Instance } from "@/types/Instance";
import { type FC } from "react";
import { getQuery } from "./helpers";

const InstancesPage: FC = () => {
  const { currentPage, pageSize, ...filters } = usePageParams();

  const { instances, instancesCount, isGettingInstances } = useGetInstances({
    query: getQuery(filters),
    archived_only: filters.status === "archived",
    with_alerts: true,
    with_upgrades: DETAILED_UPGRADES_VIEW_ENABLED,
    limit: pageSize,
    offset: (currentPage - 1) * pageSize,
  });

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
          instanceCount={instancesCount}
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
