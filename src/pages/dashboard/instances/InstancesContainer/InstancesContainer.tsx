import type { ColumnFilterOption } from "@/components/form/ColumnFilter";
import LoadingState from "@/components/layout/LoadingState";
import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import { TablePagination } from "@/components/layout/TablePagination";
import {
  InstanceList,
  InstancesHeader,
  InstancesPageActions,
} from "@/features/instances";
import type { Instance } from "@/types/Instance";
import { memo, useCallback, useState } from "react";
import classes from "./InstancesContainer.module.scss";

interface InstancesContainerProps {
  readonly instanceCount: number | undefined;
  readonly instances: Instance[];
  readonly isGettingInstances: boolean;
}

const InstancesContainer = memo(function InstancesContainer({
  instanceCount,
  instances,
  isGettingInstances,
}: InstancesContainerProps) {
  const [columnFilterOptions, setColumnFilterOptions] = useState<
    ColumnFilterOption[]
  >([]);
  const [previousInstances, setPreviousInstances] = useState(instances);
  const [selectedInstances, setSelectedInstances] = useState<Instance[]>([]);

  const handleClearSelection = useCallback(() => {
    setSelectedInstances([]);
  }, []);

  if (instances != previousInstances && !isGettingInstances) {
    setSelectedInstances([]);
    setPreviousInstances(instances);
  }

  return (
    <>
      <PageHeader
        title="Instances"
        className={classes.header}
        actions={[
          <InstancesPageActions
            key="actions"
            isGettingInstances={isGettingInstances}
            selectedInstances={selectedInstances}
          />,
        ]}
        sticky
      />
      <PageContent>
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
      </PageContent>
    </>
  );
});

export default InstancesContainer;
