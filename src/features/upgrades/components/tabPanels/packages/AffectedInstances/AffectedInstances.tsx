import type { FC } from "react";
import { useMemo } from "react";
import type { CellProps, Column } from "react-table";
import { CheckboxInput } from "@canonical/react-components";
import ExpandableTable from "@/components/layout/ExpandableTable";
import SelectAllButton from "@/components/layout/SelectAllButton";
import type { InstancePackagesToExclude, Package } from "@/features/packages";
import type { Instance } from "@/types/Instance";
import { getToggledPackage } from "../helpers";
import {
  checkIsPackageUpdateRequiredForInstance,
  getCellProps,
  getSelectedInstanceCount,
  getSelectedPackage,
  getToggleAllCheckboxState,
  getToggledInstance,
} from "./helpers";

interface AffectedInstancesProps {
  readonly currentPackage: Package;
  readonly excludedPackages: InstancePackagesToExclude[];
  readonly limit: number;
  readonly onExcludedPackagesChange: (
    newExcludedPackages: InstancePackagesToExclude[],
  ) => void;
  readonly onLimitChange: () => void;
  readonly selectedInstances: Instance[];
}

const AffectedInstances: FC<AffectedInstancesProps> = ({
  currentPackage,
  excludedPackages,
  limit,
  onExcludedPackagesChange,
  onLimitChange,
  selectedInstances,
}) => {
  const instanceIdSet = new Set(currentPackage.computers.map(({ id }) => id));

  const excludedInstances = excludedPackages.filter(({ exclude_packages }) =>
    exclude_packages.includes(currentPackage.id),
  );

  const showSelectAllButton = useMemo(() => {
    const selectedInstanceIdSet = new Set(
      selectedInstances.slice(0, limit).map(({ id }) => id),
    );

    return excludedInstances.some(({ id }) => !selectedInstanceIdSet.has(id));
  }, [excludedInstances.length, selectedInstances.length, limit]);

  const instanceData = useMemo(
    () => [
      ...selectedInstances.slice(0, showSelectAllButton ? 1 : 0),
      ...selectedInstances
        .filter(({ id }) => instanceIdSet.has(id))
        .slice(0, limit),
    ],
    [instanceIdSet, limit, selectedInstances, showSelectAllButton],
  );

  const handlePackageToggle = () => {
    onExcludedPackagesChange(
      getToggledPackage(excludedPackages, currentPackage),
    );
  };

  const handleInstanceToggle = (instanceId: number) => {
    onExcludedPackagesChange(
      getToggledInstance(excludedPackages, instanceId, currentPackage.id),
    );
  };

  const handlePackageSelect = () => {
    onExcludedPackagesChange(
      getSelectedPackage(excludedPackages, currentPackage),
    );
  };

  const toggleAllCheckboxState = getToggleAllCheckboxState({
    excludePackages: excludedPackages,
    instances: selectedInstances,
    limit,
    pkg: currentPackage,
  });

  const columns = useMemo<Column<Instance>[]>(
    () => [
      {
        accessor: "checkbox",
        className: "checkbox-column",
        Header: (
          <CheckboxInput
            inline
            label={<span className="u-off-screen">Toggle all instances</span>}
            checked={toggleAllCheckboxState === "checked"}
            indeterminate={toggleAllCheckboxState === "indeterminate"}
            onChange={handlePackageToggle}
          />
        ),
        Cell: ({ row: { index, original } }: CellProps<Instance>) =>
          showSelectAllButton && index === 0 ? (
            <SelectAllButton
              count={getSelectedInstanceCount(excludedPackages, currentPackage)}
              itemName={{
                plural: "instances",
                singular: "instance",
              }}
              onClick={handlePackageSelect}
              totalCount={instanceIdSet.size}
            />
          ) : (
            <CheckboxInput
              inline
              label={
                <span className="u-off-screen">
                  Toggle {original.title} instance
                </span>
              }
              checked={checkIsPackageUpdateRequiredForInstance(
                excludedPackages,
                original.id,
                currentPackage.id,
              )}
              onChange={() => {
                handleInstanceToggle(original.id);
              }}
            />
          ),
      },
      {
        accessor: "title",
        Header: "Name",
      },
      {
        accessor: "current_version",
        Header: "Current version",
        Cell: ({ row: { original } }: CellProps<Instance>) => (
          <>
            {
              currentPackage.computers.find(({ id }) => id === original.id)
                ?.current_version
            }
          </>
        ),
      },
      {
        accessor: "available_version",
        Header: "New version",
        Cell: ({ row: { original } }: CellProps<Instance>) => (
          <>
            {
              currentPackage.computers.find(({ id }) => id === original.id)
                ?.available_version
            }
          </>
        ),
      },
    ],
    [currentPackage, excludedPackages, instanceData],
  );

  return (
    <ExpandableTable
      columns={columns}
      data={instanceData}
      getCellProps={getCellProps(showSelectAllButton)}
      itemNames={{ plural: "instances", singular: "instance" }}
      onLimitChange={onLimitChange}
      totalCount={instanceIdSet.size}
      title={
        <p className="p-heading--4">
          Instances affected by <b>{currentPackage.name}</b>
        </p>
      }
    />
  );
};

export default AffectedInstances;
