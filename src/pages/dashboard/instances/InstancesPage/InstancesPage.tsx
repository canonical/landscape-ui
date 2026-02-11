import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import { DETAILED_UPGRADES_VIEW_ENABLED } from "@/constants";
import { InstancesPageActions, useGetInstances } from "@/features/instances";
import usePageParams from "@/hooks/usePageParams";
import type { Instance } from "@/types/Instance";
import { useCallback, useState, type FC } from "react";
import InstancesContainer from "../InstancesContainer";
import { getQuery } from "./helpers";

const InstancesPage: FC = () => {
  const { currentPage, pageSize, wsl, ...filters } = usePageParams();

  const query = getQuery(filters);

  const { instances, instancesCount, isGettingInstances } = useGetInstances({
    query,
    archived_only: filters.status === "archived",
    with_alerts: true,
    with_upgrades: DETAILED_UPGRADES_VIEW_ENABLED,
    limit: pageSize,
    offset: (currentPage - 1) * pageSize,
    wsl_children: wsl.includes("child"),
    wsl_parents: wsl.includes("parent"),
  });

  const [selectedInstances, setSelectedInstances] = useState<Instance[]>([]);

  const clearSelection = useCallback(() => {
    setSelectedInstances([]);
  }, []);

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
      />
      <PageContent hasTable>
        <InstancesContainer
          instanceCount={instancesCount}
          instances={instances}
          isGettingInstances={isGettingInstances}
          selectedInstances={selectedInstances}
          setSelectedInstances={setSelectedInstances}
          onChangeFilter={clearSelection}
        />
      </PageContent>
    </PageMain>
  );
};

export default InstancesPage;
