import type { ColumnFilterOption } from "@/components/form/ColumnFilter";
import LoadingState from "@/components/layout/LoadingState";
import { TablePagination } from "@/components/layout/TablePagination";
import {
  InstanceList,
  InstancesHeader,
  InstancesEmptyState,
  isFilteringInstances,
  PendingInstancesNotification,
} from "@/features/instances";
import type { Instance } from "@/types/Instance";
import { memo, useState } from "react";
import usePageParams from "@/hooks/usePageParams";

interface InstancesContainerProps {
  readonly instanceCount: number | undefined;
  readonly instances: Instance[];
  readonly selectedInstances: Instance[];
  readonly setSelectedInstances: (instances: Instance[]) => void;
  readonly onChangeFilter: () => void;
  readonly isAllSelected: boolean;
  readonly onSelectAll: () => void;
  readonly onClearSelection: () => void;
  readonly isGettingInstances: boolean;
}

const InstancesContainer = memo(function InstancesContainer({
  instanceCount,
  instances,
  isGettingInstances,
  selectedInstances,
  setSelectedInstances,
  onChangeFilter,
  isAllSelected,
  onSelectAll,
  onClearSelection,
}: InstancesContainerProps) {
  const [columnFilterOptions, setColumnFilterOptions] = useState<
    ColumnFilterOption[]
  >([]);

  const pageParams = usePageParams();

  const hasNoInstances =
    !isGettingInstances &&
    instanceCount === 0 &&
    !isFilteringInstances(pageParams);

  return (
    <>
      {!hasNoInstances && (
        <InstancesHeader
          columnFilterOptions={columnFilterOptions}
          onChangeFilter={onChangeFilter}
        />
      )}
      <PendingInstancesNotification />
      {hasNoInstances ? (
        <InstancesEmptyState />
      ) : (
        <>
          {isGettingInstances ? (
            <LoadingState />
          ) : (
            <InstanceList
              instances={instances}
              instanceCount={instanceCount}
              selectedInstances={selectedInstances}
              setColumnFilterOptions={setColumnFilterOptions}
              setSelectedInstances={setSelectedInstances}
              isAllSelected={isAllSelected}
              onSelectAll={onSelectAll}
              onClearSelection={onClearSelection}
            />
          )}

          <TablePagination
            totalItems={instanceCount}
            currentItemCount={instances.length}
          />
        </>
      )}
    </>
  );
});

export default InstancesContainer;
