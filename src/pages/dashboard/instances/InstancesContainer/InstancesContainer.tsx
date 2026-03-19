import type { ColumnFilterOption } from "@/components/form/ColumnFilter";
import LoadingState from "@/components/layout/LoadingState";
import { TablePagination } from "@/components/layout/TablePagination";
import { InstanceList, InstancesHeader } from "@/features/instances";
import type { Instance } from "@/types/Instance";
import { memo, useState } from "react";

interface InstancesContainerProps {
  readonly instanceCount: number | undefined;
  readonly instances: Instance[];
  readonly isGettingInstances: boolean;
  readonly selectedInstances: Instance[];
  readonly setSelectedInstances: (instances: Instance[]) => void;
  readonly onChangeFilter: () => void;
}

const InstancesContainer = memo(function InstancesContainer({
  instanceCount,
  instances,
  isGettingInstances,
  selectedInstances,
  setSelectedInstances,
  onChangeFilter,
}: InstancesContainerProps) {
  const [columnFilterOptions, setColumnFilterOptions] = useState<
    ColumnFilterOption[]
  >([]);

  return (
    <>
      <InstancesHeader
        columnFilterOptions={columnFilterOptions}
        onChangeFilter={onChangeFilter}
      />

      {isGettingInstances ? (
        <LoadingState />
      ) : (
        <InstanceList
          instances={instances}
          instanceCount={instanceCount}
          selectedInstances={selectedInstances}
          setColumnFilterOptions={setColumnFilterOptions}
          setSelectedInstances={setSelectedInstances}
        />
      )}

      <TablePagination
        totalItems={instanceCount}
        currentItemCount={instances.length}
      />
    </>
  );
});

export default InstancesContainer;
