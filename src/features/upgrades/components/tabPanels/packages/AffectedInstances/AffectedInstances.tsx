import { FC, useMemo, useState } from "react";
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
  getToggledInstance,
} from "./helpers";

interface AffectedInstancesProps {
  currentPackage: Package;
  excludedPackages: InstancePackagesToExclude[];
  onExcludedPackagesChange: (
    newExcludedPackages: InstancePackagesToExclude[],
  ) => void;
  selectedInstances: Instance[];
}

const AffectedInstances: FC<AffectedInstancesProps> = ({
  currentPackage,
  excludedPackages,
  onExcludedPackagesChange,
  selectedInstances,
}) => {
  const [limit, setLimit] = useState(5);

  const instanceIds = currentPackage.computers.map(({ id }) => id);

  const instanceData = useMemo(
    () =>
      selectedInstances
        .filter(({ id }) => instanceIds.includes(id))
        .slice(0, limit),
    [instanceIds, limit, selectedInstances],
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
        Cell: ({ row: { original } }: CellProps<Instance>) => (
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
      itemNames={{ plural: "instances", singular: "instance" }}
      onLimitChange={() => setLimit((prevState) => prevState + 5)}
      totalCount={instanceIds.length}
      title={
        <p className="p-heading--4">
          Instances affected by <b>{currentPackage.name}</b>
        </p>
      }
    />
  );
};

export default AffectedInstances;
