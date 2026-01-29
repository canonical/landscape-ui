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

  const { instances, instancesCount, isGettingInstances } = useGetInstances({
    query: getQuery(filters),
    archived_only: filters.status === "archived",
    with_alerts: true,
    with_upgrades: DETAILED_UPGRADES_VIEW_ENABLED,
    limit: pageSize,
    offset: (currentPage - 1) * pageSize,
    wsl_children: wsl.includes("child"),
    wsl_parents: wsl.includes("parent"),
  });

  const {
    value: allInstancesSelected,
    setTrue: selectAllInstances,
    setFalse: deselectAllInstances,
  } = useBoolean();

  const [toggledInstances, setToggledInstances] = useState<Instance[]>([]);

  const [columnFilterOptions, setColumnFilterOptions] = useState<
    ColumnFilterOption[]
  >([]);

  const handleClearSelection = () => {
    setToggledInstances([]);
  };

  return (
    <PageMain>
      <PageHeader
        title="Instances"
        actions={[
          <InstancesPageActions
            key="actions"
            isGettingInstances={isGettingInstances}
            selectedInstances={toggledInstances}
          />,
        ]}
      />
      <PageContent hasTable>
        <InstancesHeader columnFilterOptions={columnFilterOptions} />
        <InstanceList
          instanceCount={instancesCount}
          instances={instances}
          isGettingInstances={isGettingInstances}
          toggledInstances={toggledInstances}
          setToggledInstances={setToggledInstances}
          areAllInstancesSelected={allInstancesSelected}
          selectAllInstances={selectAllInstances}
          deselectAllInstances={deselectAllInstances}
          setColumnFilterOptions={setColumnFilterOptions}
        />
        <TablePagination
          totalItems={instancesCount}
          handleClearSelection={handleClearSelection}
          currentItemCount={instances.length}
        />
      </PageContent>
    </PageMain>
  );
};

export default InstancesPage;
