import { FC, useMemo } from "react";
import { CellProps, Column } from "react-table";
import { CheckboxInput } from "@canonical/react-components";
import ExpandableTable from "@/components/layout/ExpandableTable";
import { InstancePackagesToExclude, Package } from "@/features/packages";
import { Instance } from "@/types/Instance";
import {
  checkIsPackageUpdateRequired,
  checkIsPackageUpdateRequiredForAllInstances,
  getToggledPackage,
} from "../helpers";
import {
  checkIsPackageUpdateRequiredForInstance,
  getCellProps,
  getToggledInstance,
} from "./helpers";
import SelectAllButton from "@/components/layout/SelectAllButton";

interface AffectedInstancesProps {
  currentPackage: Package;
  excludedPackages: InstancePackagesToExclude[];
  limit: number;
  onExcludedPackagesChange: (
    newExcludedPackages: InstancePackagesToExclude[],
  ) => void;
  onLimitChange: () => void;
  selectedInstances: Instance[];
}

const AffectedInstances: FC<AffectedInstancesProps> = ({
  currentPackage,
  excludedPackages,
  limit,
  onExcludedPackagesChange,
  onLimitChange,
  selectedInstances,
}) => {
  const instanceIds = new Set(currentPackage.computers.map(({ id }) => id));

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
        .filter(({ id }) => instanceIds.has(id))
        .slice(0, limit),
    ],
    [instanceIds, limit, selectedInstances, showSelectAllButton],
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

  const isPackageUpdateRequiredForAllInstances =
    checkIsPackageUpdateRequiredForAllInstances(
      excludedPackages,
      currentPackage,
    );

  const columns = useMemo<Column<Instance>[]>(
    () => [
      {
        accessor: "checkbox",
        className: "checkbox-column",
        Header: (
          <CheckboxInput
            inline
            label={<span className="u-off-screen">Toggle all instances</span>}
            checked={isPackageUpdateRequiredForAllInstances}
            indeterminate={
              !isPackageUpdateRequiredForAllInstances &&
              checkIsPackageUpdateRequired(excludedPackages, currentPackage)
            }
            onChange={handlePackageToggle}
          />
        ),
        Cell: ({ row: { index, original } }: CellProps<Instance>) =>
          showSelectAllButton && index === 0 ? (
            <SelectAllButton
              count={selectedInstances.length - excludedInstances.length}
              itemName={{
                plural: "instances",
                singular: "instance",
              }}
              onClick={() =>
                selectedInstances.map(({ id }) => ({
                  id,
                  exclude_packages: [],
                }))
              }
              totalCount={selectedInstances.length}
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
              onChange={() => handleInstanceToggle(original.id)}
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
      totalCount={instanceIds.size}
      title={
        <p className="p-heading--4">
          Instances affected by <b>{currentPackage.name}</b>
        </p>
      }
    />
  );
};

export default AffectedInstances;
