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
import { useCallback, useEffect, useState, type FC } from "react";
import InstancesContainer from "../InstancesContainer";
import { getQuery } from "./helpers";

const InstancesPage: FC = () => {
  const { currentPage, pageSize, wsl, ...filters } = usePageParams();
  const instanceListParams = getInstanceListParams({ filters, wsl });
  const { query } = filters;

  const { instances, instancesCount, isGettingInstances } = useGetInstances({
    query: getQuery(filters),
    archived_only: filters.status === "archived",
    with_alerts: true,
    with_release_upgrades: true,
    with_upgrades: DETAILED_UPGRADES_VIEW_ENABLED,
    limit: pageSize,
    offset: (currentPage - 1) * pageSize,
    wsl_children: wsl.includes("child"),
    wsl_parents: wsl.includes("parent"),
  });

  const [selectedInstances, setSelectedInstances] = useState<Instance[]>([]);

  // Clear the selection when the search query changes (e.g. following a report
  // deep link), matching how header filter changes reset it.
  const [isAllSelected, setIsAllSelected] = useState(false);

  useEffect(() => {
    setSelectedInstances([]);
    setIsAllSelected(false);
  }, [query]);

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
            instanceCount={instancesCount}
            exportParams={instanceListParams}
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
          isGettingInstances={isGettingInstances}
          selectedInstances={selectedInstances}
          setSelectedInstances={setSelectedInstances}
          isAllSelected={isAllSelected}
          onSelectAll={selectAll}
          onClearSelection={clearSelection}
          onChangeFilter={clearSelection}
        />
      </PageContent>
    </PageMain>
  );
};

export default InstancesPage;
