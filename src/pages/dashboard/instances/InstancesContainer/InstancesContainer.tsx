import type { ColumnFilterOption } from "@/components/form/ColumnFilter";
import LoadingState from "@/components/layout/LoadingState";
import { TablePagination } from "@/components/layout/TablePagination";
import { DETAILED_UPGRADES_VIEW_ENABLED } from "@/constants";
import { InstanceList, InstancesHeader } from "@/features/instances";
import useInstances from "@/hooks/useInstances";
import usePageParams from "@/hooks/usePageParams";
import type { Instance } from "@/types/Instance";
import { memo, useCallback, useState } from "react";
import { getQuery } from "./helpers";

interface InstancesContainerProps {
  readonly selectedInstances: Instance[];
  readonly setSelectedInstances: (instances: Instance[]) => void;
}

const InstancesContainer = memo(function InstancesContainer({
  selectedInstances,
  setSelectedInstances,
}: InstancesContainerProps) {
  const [columnFilterOptions, setColumnFilterOptions] = useState<
    ColumnFilterOption[]
  >([]);
  const { currentPage, pageSize, groupBy, ...filters } = usePageParams();
  const { getInstancesQuery } = useInstances();

  const { data: getInstancesQueryResult, isLoading: getInstancesQueryLoading } =
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

  const handleClearSelection = useCallback(() => {
    setSelectedInstances([]);
  }, []);

  return (
    <>
      <InstancesHeader columnFilterOptions={columnFilterOptions} />

      {getInstancesQueryLoading ? (
        <LoadingState />
      ) : (
        <InstanceList
          instances={instances}
          selectedInstances={selectedInstances}
          setColumnFilterOptions={setColumnFilterOptions}
          setSelectedInstances={setSelectedInstances}
        />
      )}
      <TablePagination
        totalItems={getInstancesQueryResult?.data.count}
        handleClearSelection={handleClearSelection}
        currentItemCount={instances.length}
      />
    </>
  );
});

export default InstancesContainer;
