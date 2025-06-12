import type { ColumnFilterOption } from "@/components/form/ColumnFilter";
import LoadingState from "@/components/layout/LoadingState";
import { TablePagination } from "@/components/layout/TablePagination";
import { InstanceList, InstancesHeader } from "@/features/instances";
import type { Instance } from "@/types/Instance";
import { memo, useCallback, useState } from "react";

interface InstancesContainerProps {
  readonly instanceCount: number | undefined;
  readonly instances: Instance[];
  readonly isGettingInstances: boolean;
  readonly selectedInstances: Instance[];
  readonly setSelectedInstances: (instances: Instance[]) => void;
}

const InstancesContainer = memo(function InstancesContainer({
  instanceCount,
  instances,
  isGettingInstances,
  selectedInstances,
  setSelectedInstances,
}: InstancesContainerProps) {
  const [columnFilterOptions, setColumnFilterOptions] = useState<
    ColumnFilterOption[]
  >([]);

  const handleClearSelection = useCallback(() => {
    setSelectedInstances([]);
  }, []);

  return (
    <>
      <InstancesHeader columnFilterOptions={columnFilterOptions} />

      {isGettingInstances ? (
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
        totalItems={instanceCount}
        handleClearSelection={handleClearSelection}
        currentItemCount={instances.length}
      />
    </>
  );
});

export default InstancesContainer;
