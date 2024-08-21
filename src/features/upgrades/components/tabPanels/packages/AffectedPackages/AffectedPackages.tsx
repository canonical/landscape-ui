import classNames from "classnames";
import { FC, useMemo, useState } from "react";
import { CellProps, Column } from "react-table";
import { Button, CheckboxInput } from "@canonical/react-components";
import ExpandableTable from "@/components/layout/ExpandableTable";
import { OldPackage, UpgradeInstancePackagesParams } from "@/features/packages";
import { Instance } from "@/types/Instance";
import AffectedInstances from "../AffectedInstances";
import { checkIsUpdateRequired, getToggledPackage } from "../helpers";
import {
  areAllInstancesNeedToUpdate,
  areAllPackagesNeedToUpdate,
  getToggledPackages,
  handleCellProps,
} from "./helpers";
import classes from "./AffectedPackages.module.scss";

interface AffectedPackagesProps {
  excludedPackages: UpgradeInstancePackagesParams[];
  instances: Instance[];
  onExcludedPackagesChange: (
    newExcludedPackages: UpgradeInstancePackagesParams[],
  ) => void;
  onTableLimitChange: () => void;
  packages: OldPackage[];
  totalPackageCount: number;
}

const AffectedPackages: FC<AffectedPackagesProps> = ({
  excludedPackages,
  instances,
  onExcludedPackagesChange,
  onTableLimitChange,
  packages,
  totalPackageCount,
}) => {
  const [expandedRow, setExpandedRow] = useState(-1);

  const packageData = useMemo(
    () =>
      expandedRow > -1
        ? [
            ...packages.slice(0, expandedRow + 1),
            ...packages.slice(expandedRow),
          ]
        : packages,
    [packages, expandedRow],
  );

  const uniquePackages = Object.values(
    packages.reduce(
      (acc, current) => {
        if (!acc[current.name]) {
          acc[current.name] = current;
        }

        return acc;
      },
      {} as Record<string, OldPackage>,
    ),
  );

  const isUpdateRequired = checkIsUpdateRequired(
    excludedPackages,
    uniquePackages,
  );

  const handleAllPackagesToggle = () => {
    onExcludedPackagesChange(
      getToggledPackages(excludedPackages, uniquePackages, isUpdateRequired),
    );
  };

  const handlePackageToggle = (pkg: OldPackage) => {
    onExcludedPackagesChange(getToggledPackage(excludedPackages, pkg));
  };

  const handleExpandCellClick = (index: number) => {
    setExpandedRow((prevState) => {
      if (prevState === index) {
        return -1;
      }

      return index > prevState && prevState !== -1 ? index - 1 : index;
    });
  };

  const columns = useMemo<Column<OldPackage>[]>(
    () => [
      {
        accessor: "checkbox",
        className: "checkbox-column",
        Header: (
          <CheckboxInput
            inline
            label={<span className="u-off-screen">Toggle all packages</span>}
            disabled={packageData.length === 0}
            checked={areAllPackagesNeedToUpdate(
              uniquePackages,
              excludedPackages,
            )}
            indeterminate={
              !areAllPackagesNeedToUpdate(uniquePackages, excludedPackages) &&
              isUpdateRequired
            }
            onChange={handleAllPackagesToggle}
          />
        ),
        Cell: ({ row: { original } }: CellProps<OldPackage>) => (
          <CheckboxInput
            inline
            label={
              <span className="u-off-screen">
                Toggle {original.name} package
              </span>
            }
            checked={areAllInstancesNeedToUpdate(original, excludedPackages)}
            indeterminate={
              !areAllInstancesNeedToUpdate(original, excludedPackages) &&
              checkIsUpdateRequired(excludedPackages, [original])
            }
            onChange={() => handlePackageToggle(original)}
          />
        ),
      },
      {
        accessor: "name",
        Header: "Package name",
        Cell: ({ row: { index, original } }: CellProps<OldPackage>) => {
          if (expandedRow === -1 || expandedRow !== index - 1) {
            return <>{original.name}</>;
          }

          return (
            <AffectedInstances
              currentPackage={original}
              excludedPackages={excludedPackages}
              onExcludedPackagesChange={onExcludedPackagesChange}
              selectedInstances={instances}
            />
          );
        },
      },
      {
        accessor: "current_version",
        Header: "Current version",
      },
      {
        accessor: "version",
        Header: "New version",
      },
      {
        accessor: "computers.upgrades",
        Header: "Affected instances",
        Cell: ({ row: { index, original } }: CellProps<OldPackage>) => (
          <Button
            type="button"
            className={classNames("p-accordion__tab", classes.expandButton)}
            aria-expanded={expandedRow === index}
            onClick={() => handleExpandCellClick(index)}
          >
            {original.computers.upgrades.length}
          </Button>
        ),
      },
    ],
    [packageData, instances, excludedPackages, expandedRow],
  );

  return (
    <ExpandableTable
      columns={columns}
      data={packageData}
      getCellProps={handleCellProps(expandedRow, packageData.length === 0)}
      itemNames={{ plural: "packages", singular: "package" }}
      onLimitChange={onTableLimitChange}
      totalCount={totalPackageCount}
    />
  );
};

export default AffectedPackages;
