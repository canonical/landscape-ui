import type { FC } from "react";
import { useState } from "react";
import LoadingState from "@/components/layout/LoadingState";
import { TablePagination } from "@/components/layout/TablePagination";
import useInstances from "@/hooks/useInstances";
import type { Instance } from "@/types/Instance";
import usePageParams from "@/hooks/usePageParams";
import { getQuery } from "./helpers";
import { InstanceList, InstancesHeader } from "@/features/instances";
import type { ColumnFilterOption } from "@/components/form/ColumnFilter";

interface InstancesContainerProps {
  readonly selectedInstances: Instance[];
  readonly setSelectedInstances: (instances: Instance[]) => void;
}

const InstancesContainer: FC<InstancesContainerProps> = ({
  selectedInstances,
  setSelectedInstances,
}) => {
  const [columnFilterOptions, setColumnFilterOptions] = useState<
    ColumnFilterOption[]
  >([]);
  const { currentPage, pageSize, groupBy, ...filters } = usePageParams();
  const { getInstancesQuery } = useInstances();

  const { data: getInstancesQueryResult, isLoading: getInstancesQueryLoading } =
    getInstancesQuery({
      query: getQuery(filters),
      root_only: groupBy === "parent",
      with_alerts: true,
      with_upgrades: true,
      limit: pageSize,
      offset: (currentPage - 1) * pageSize,
    });

  const instances = getInstancesQueryResult?.data.results ?? [];
  const instancesCount = getInstancesQueryResult?.data.count ?? 0;

  const handleClearSelection = () => {
    setSelectedInstances([]);
  };

  return (
    <>
      <InstancesHeader columnFilterOptions={columnFilterOptions} />

      {getInstancesQueryLoading ? (
        <LoadingState />
      ) : (
        <InstanceList
          instances={instances}
          selectedInstances={selectedInstances}
          setColumnFilterOptions={(options) => setColumnFilterOptions(options)}
          setSelectedInstances={(instances) => setSelectedInstances(instances)}
        />
      )}
      <TablePagination
        totalItems={instancesCount}
        handleClearSelection={handleClearSelection}
        currentItemCount={instances.length}
      />
    </>
  );
};

export default InstancesContainer;
