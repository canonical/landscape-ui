import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import { DETAILED_UPGRADES_VIEW_ENABLED } from "@/constants";
import {
  getInstanceListParams,
  InstancesPageActions,
  setSelectedInstanceIds,
  useGetInstances,
} from "@/features/instances";
import usePageParams from "@/hooks/usePageParams";
import type { Instance } from "@/types/Instance";
import { useCallback, useEffect, useMemo, useState, type FC } from "react";
import InstancesContainer from "../InstancesContainer";

const InstancesPage: FC = () => {
  const { currentPage, pageSize, wsl, ...filters } = usePageParams();
  const { query } = filters;
  const instanceListParams = useMemo(
    () => getInstanceListParams({ filters, wsl }),
    [filters, wsl],
  );

  const { instances, instancesCount, isGettingInstances } = useGetInstances({
    ...instanceListParams,
    with_alerts: true,
    with_release_upgrades: true,
    with_upgrades: DETAILED_UPGRADES_VIEW_ENABLED,
    limit: pageSize,
    offset: (currentPage - 1) * pageSize,
  });

  const [selectedInstances, setSelectedInstances] = useState<Instance[]>([]);
  const [isAllSelected, setIsAllSelected] = useState(false);

  // Clear the selection when the search query changes (e.g. following a report
  // deep link), matching how header filter changes reset it. Resetting state
  // during render (React's documented pattern) avoids an extra commit.
  const [trackedQuery, setTrackedQuery] = useState(query);
  if (trackedQuery !== query) {
    setTrackedQuery(query);
    setSelectedInstances([]);
    setIsAllSelected(false);
  }

  // Mirror the selection into an external store so side panel content (whose
  // props are frozen when the panel opens) can detect selection changes.
  useEffect(() => {
    setSelectedInstanceIds(selectedInstances.map(({ id }) => id));
  }, [selectedInstances]);

  const clearSelection = useCallback(() => {
    setSelectedInstances([]);
    setIsAllSelected(false);
  }, []);

  const selectAll = useCallback(() => {
    setIsAllSelected(true);
    setSelectedInstances([]);
  }, []);

  return (
    <PageMain>
      <PageHeader
        title="Instances"
        actions={[
          <InstancesPageActions
            key="actions"
            exportParams={instanceListParams}
            instanceCount={instancesCount}
            isGettingInstances={isGettingInstances}
            selectedInstances={selectedInstances}
            isAllSelected={isAllSelected}
          />,
        ]}
      />
      <PageContent hasTable>
        <InstancesContainer
          instanceCount={instancesCount}
          instances={instances}
          selectedInstances={selectedInstances}
          setSelectedInstances={setSelectedInstances}
          onChangeFilter={clearSelection}
          isGettingInstances={isGettingInstances}
          isAllSelected={isAllSelected}
          onSelectAll={selectAll}
          onClearSelection={clearSelection}
        />
      </PageContent>
    </PageMain>
  );
};

export default InstancesPage;
