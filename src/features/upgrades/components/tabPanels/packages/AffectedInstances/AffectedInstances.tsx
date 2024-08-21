import { FC, useMemo, useState } from "react";
import { CellProps, Column } from "react-table";
import { CheckboxInput } from "@canonical/react-components";
import ExpandableTable from "@/components/layout/ExpandableTable";
import { OldPackage, UpgradeInstancePackagesParams } from "@/features/packages";
import { Instance } from "@/types/Instance";
import { checkIsUpdateRequired, getToggledPackage } from "../helpers";
import {
  areAllInstancesNeedToUpdate,
  isInstanceNeedToUpdatePackage,
} from "./helpers";
import classes from "./AffectedInstances.module.scss";

interface AffectedInstancesProps {
  currentPackage: OldPackage;
  excludedPackages: UpgradeInstancePackagesParams[];
  onExcludedPackagesChange: (
    newExcludedPackages: UpgradeInstancePackagesParams[],
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

  const instanceIds = currentPackage.computers.upgrades;

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
    const updatedExcludedPackages = excludedPackages.map(
      ({ id, exclude_packages }) => {
        if (id !== instanceId) {
          return { id, exclude_packages };
        }

        return {
          id,
          exclude_packages: exclude_packages.includes(currentPackage.name)
            ? exclude_packages.filter((name) => name !== currentPackage.name)
            : [...exclude_packages, currentPackage.name],
        };
      },
    );

    onExcludedPackagesChange(updatedExcludedPackages);
  };

  const columns = useMemo<Column<Instance>[]>(
    () => [
      {
        accessor: "checkbox",
        className: "checkbox-column",
        Header: (
          <CheckboxInput
            inline
            label={<span className="u-off-screen">Toggle all instances</span>}
            checked={areAllInstancesNeedToUpdate(
              excludedPackages,
              currentPackage,
            )}
            indeterminate={
              !areAllInstancesNeedToUpdate(excludedPackages, currentPackage) &&
              checkIsUpdateRequired(excludedPackages, [currentPackage])
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
            checked={isInstanceNeedToUpdatePackage(
              excludedPackages,
              original.id,
              currentPackage.name,
            )}
            onChange={() => handleInstanceToggle(original.id)}
          />
        ),
      },
      {
        accessor: "title",
        className: classes.name,
        Header: "Name",
      },
      {
        accessor: "current_version",
        Header: "Current version",
        Cell: currentPackage.version,
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
