import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import SidePanel from "@/components/layout/SidePanel";
import { DETAILED_UPGRADES_VIEW_ENABLED } from "@/constants";
import { InstancesPageActions, useGetInstances, getExportTitle } from "@/features/instances";
import useSetDynamicFilterValidation from "@/hooks/useDynamicFilterValidation";
import usePageParams from "@/hooks/usePageParams";
import useSelection from "@/hooks/useSelection";
import { DEFAULT_PAGE_SIZE } from "@/libs/pageParamsManager/constants";
import type { Instance } from "@/types/Instance";
import { lazy, useCallback, useState, type FC } from "react";
import InstancesContainer from "../InstancesContainer";
import { getQuery } from "./helpers";

const InstancesExportForm = lazy(
  async () => import("@/features/instances/components/InstancesExportForm"),
);

const InstancesPage: FC = () => {
  const {
    currentPage,
    pageSize,
    wsl,
    lastSidePathSegment,
    popSidePath,
    ...filters
  } = usePageParams();

  useSetDynamicFilterValidation("sidePath", ["export"]);

  const instanceListParams = {
    wsl,
    ...getQuery(filters),
    limit: pageSize,
    offset: (currentPage - 1) * pageSize,
  };

  const { instances, instancesCount, isGettingInstances } = useGetInstances({
    ...instanceListParams,
    with_alerts: true,
    with_release_upgrades: true,
    with_upgrades: DETAILED_UPGRADES_VIEW_ENABLED,
  });

  const {
    selectedItems: selectedInstances,
    setSelectedItems: setSelectedInstances,
  } = useSelection<Instance>(instances, isGettingInstances);

  const [isAllSelected, setIsAllSelected] = useState(false);

  const clearSelection = useCallback(() => {
    setSelectedInstances([]);
    setIsAllSelected(false);
  }, [setSelectedInstances]);

  const selectAll = useCallback(() => {
    setIsAllSelected(true);
    setSelectedInstances([]);
  }, [setSelectedInstances]);

  return (
    <PageMain>
      <PageHeader
        title="Instances"
        actions={[
          <InstancesPageActions
            key="actions"
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
          isAllSelected={isAllSelected}
          onSelectAll={selectAll}
          onClearSelection={clearSelection}
          onChangeFilter={clearSelection}
          isGettingInstances={isGettingInstances}
        />
      </PageContent>
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
                selectedCount: selectedInstances.length,
                totalCount: instancesCount,
                selectionForms: ["instance", "instances"],
              })}
            </SidePanel.Header>
            <SidePanel.Content>
              <InstancesExportForm
                exportParams={instanceListParams}
                selectedInstanceIds={
                  !isAllSelected && selectedInstances.length > 0
                    ? selectedInstances.map(({ id }) => id)
                    : undefined
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
