import type { ColumnFilterOption } from "@/components/form/ColumnFilter";
import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import { TablePagination } from "@/components/layout/TablePagination";
import { DETAILED_UPGRADES_VIEW_ENABLED } from "@/constants";
import {
  InstanceList,
  InstancesHeader,
  InstancesPageActions,
  useGetInstances,
} from "@/features/instances";
import usePageParams from "@/hooks/usePageParams";
import type { Instance } from "@/types/Instance";
import { useState, type FC } from "react";
import { useBoolean } from "usehooks-ts";
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

  const {
    value: areAllInstancesSelected,
    setTrue: selectAllInstances,
    setFalse: deselectAllInstances,
  } = useBoolean();

  const [toggledInstances, setToggledInstances] = useState<Instance[]>([]);

  const [columnFilterOptions, setColumnFilterOptions] = useState<
    ColumnFilterOption[]
  >([]);

  const clearSelection = () => {
    if (!areAllInstancesSelected && toggledInstances.length === 0) {
      return;
    }

    setToggledInstances([]);
    deselectAllInstances();
  };

  return (
    <PageMain>
      <PageHeader
        title="Instances"
        actions={[
          <InstancesPageActions
            key="actions"
            isGettingInstances={isGettingInstances}
            toggledInstances={toggledInstances}
            areAllInstancesSelected={areAllInstancesSelected}
            instanceCount={instancesCount}
            query={query}
          />,
        ]}
      />
      <PageContent hasTable>
        <InstancesHeader
          columnFilterOptions={columnFilterOptions}
          onChangeFilter={clearSelection}
        />
        <InstanceList
          instanceCount={instancesCount}
          instances={instances}
          isGettingInstances={isGettingInstances}
          toggledInstances={toggledInstances}
          setToggledInstances={setToggledInstances}
          areAllInstancesSelected={areAllInstancesSelected}
          selectAllInstances={selectAllInstances}
          deselectAllInstances={deselectAllInstances}
          setColumnFilterOptions={setColumnFilterOptions}
        />
        <TablePagination
          totalItems={instancesCount}
          currentItemCount={instances.length}
        />
      </PageContent>
    </PageMain>
  );
};

export default InstancesPage;
