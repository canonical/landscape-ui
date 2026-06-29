import type { ColumnFilterOption } from "@/components/form/ColumnFilter";
import LoadingState from "@/components/layout/LoadingState";
import { TablePagination } from "@/components/layout/TablePagination";
import { InstanceList, InstancesHeader } from "@/features/instances";
import type { Instance } from "@/types/Instance";
import { memo, useState } from "react";
import usePageParams from "@/hooks/usePageParams";
import { isInstanceLoadingState, isInstancesEmptyState } from "./helpers";

interface InstancesContainerProps {
  readonly instanceCount: number | undefined;
  readonly instances: Instance[];
  readonly selectedInstances: Instance[];
  readonly setSelectedInstances: (instances: Instance[]) => void;
  readonly onChangeFilter: () => void;
  readonly isInstanceLoading: boolean,
}

const InstancesContainer = memo(function InstancesContainer({
  instanceCount,
  instances,
  isInstanceLoading,
  selectedInstances,
  setSelectedInstances,
  onChangeFilter,
}: InstancesContainerProps) {
  const [columnFilterOptions, setColumnFilterOptions] = useState<
    ColumnFilterOption[]
  >([]);

  const { currentPage, pageSize, search, status } = usePageParams();

  if (
    isInstancesEmptyState(
      currentPage,
      pageSize,
      instanceCount,
      search,
      status,
      isInstanceLoading,
    )
  ) {
    return <></>;
  }

  return (
    <>
      <InstancesHeader
        columnFilterOptions={columnFilterOptions}
        onChangeFilter={onChangeFilter}
      />

      {isInstanceLoadingState(currentPage, pageSize, isInstanceLoading) ? (
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
