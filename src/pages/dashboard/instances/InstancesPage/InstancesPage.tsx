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
  const { currentPage, pageSize, wsl, healthBand, ...filters } =
    usePageParams();

  const { instances, instancesCount, isGettingInstances } = useGetInstances({
    query: getQuery(filters),
    archived_only: filters.status === "archived",
    with_alerts: true,
    with_release_upgrades: true,
    with_upgrades: DETAILED_UPGRADES_VIEW_ENABLED,
    // LA061 Phase 1.7: fold the health snapshot into the list response so
    // HealthCell can render without firing one HTTP request per row.
    with_health: true,
    limit: pageSize,
    offset: (currentPage - 1) * pageSize,
    wsl_children: wsl.includes("child"),
    wsl_parents: wsl.includes("parent"),
    // LA061: categorical health-band filter. Omitted when the array is empty
    // so we don't churn the query cache on every navigation.
    ...(healthBand.length > 0 ? { health_band: healthBand.join(",") } : {}),
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
