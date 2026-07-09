import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import SidePanel from "@/components/layout/SidePanel";
import { DETAILED_UPGRADES_VIEW_ENABLED } from "@/constants";
import {
  getInstanceListParams,
  InstancesPageActions,
  useGetInstances,
} from "@/features/instances";
import { getExportTitle } from "@/features/exports";
import usePageParams from "@/hooks/usePageParams";
import type { Instance } from "@/types/Instance";
import { lazy, useCallback, useMemo, useState, type FC } from "react";
import InstancesContainer from "../InstancesContainer";

const InstancesExportForm = lazy(
  async () =>
    import("@/features/instances/components/InstancesExportForm/InstancesExportForm"),
);

const InstancesPage: FC = () => {
  const {
    currentPage,
    pageSize,
    wsl,
    lastSidePathSegment,
    popSidePathUntilClear,
    ...filters
  } = usePageParams();
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
      <SidePanel
        isOpen={lastSidePathSegment === "export"}
        onClose={popSidePathUntilClear}
        size="medium"
      >
        {lastSidePathSegment === "export" && (
          <SidePanel.Suspense key="export">
            <SidePanel.Header>
              {getExportTitle({
                isAllSelected,
                selectedCount: selectedInstances.length,
                totalCount: instancesCount,
                selectionForms: ["instance"],
              })}
            </SidePanel.Header>
            <SidePanel.Content>
              <InstancesExportForm
                exportParams={instanceListParams}
                selectedInstanceIds={
                  isAllSelected
                    ? undefined
                    : selectedInstances.map(({ id }) => id)
                }
              />
            </SidePanel.Content>
          </SidePanel.Suspense>
        )}
      </SidePanel>
    </PageMain>
  );
};

export default InstancesPage;
