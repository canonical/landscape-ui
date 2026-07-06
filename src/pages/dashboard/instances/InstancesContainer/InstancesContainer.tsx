import type { ColumnFilterOption } from "@/components/form/ColumnFilter";
import LoadingState from "@/components/layout/LoadingState";
import { TablePagination } from "@/components/layout/TablePagination";
import {
  InstanceList,
  InstancesHeader,
  InstancesEmptyState,
} from "@/features/instances";
import type { Instance } from "@/types/Instance";
import { memo, useState } from "react";
import usePageParams from "@/hooks/usePageParams";
import { DEFAULT_PAGE_SIZE } from "@/libs/pageParamsManager";

interface InstancesContainerProps {
  readonly instanceCount: number | undefined;
  readonly instances: Instance[];
  readonly selectedInstances: Instance[];
  readonly setSelectedInstances: (instances: Instance[]) => void;
  readonly onChangeFilter: () => void;
  readonly isGettingInstances: boolean;
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

  const {
    currentPage,
    pageSize,
    query,
    status,
    os,
    contractExpiryDays,
    accessGroups,
    availabilityZones,
    tags,
    wsl,
  } = usePageParams();

  const isFilteringInstances =
    !!query ||
    !!status ||
    !!os ||
    !!contractExpiryDays ||
    accessGroups.length > 0 ||
    availabilityZones.length > 0 ||
    tags.length > 0 ||
    wsl.length > 0;

  const hasNoInstances =
    !isGettingInstances &&
    currentPage === 1 &&
    pageSize === DEFAULT_PAGE_SIZE &&
    instanceCount === 0 &&
    !isFilteringInstances;

  if (hasNoInstances) {
    return <InstancesEmptyState />;
  }

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
