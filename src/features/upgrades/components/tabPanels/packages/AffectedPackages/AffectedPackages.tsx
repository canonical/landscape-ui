import classNames from "classnames";
import { FC, useMemo, useState } from "react";
import { CellProps, Column } from "react-table";
import { Button, CheckboxInput } from "@canonical/react-components";
import ExpandableTable from "@/components/layout/ExpandableTable";
import { Package, UpgradeInstancePackagesParams } from "@/features/packages";
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
  packages: Package[];
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
      {} as Record<string, Package>,
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

  const handlePackageToggle = (pkg: Package) => {
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

  const columns = useMemo<Column<Package>[]>(
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
        Cell: ({ row: { original } }: CellProps<Package>) => (
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
        className: classes.nameColumn,
        Header: "Package name",
        Cell: ({ row: { index, original } }: CellProps<Package>) => {
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
        accessor: "computers.upgrades",
        Header: "Affected instances",
        Cell: ({ row: { index, original } }: CellProps<Package>) => (
          <Button
            type="button"
            className={classNames("p-accordion__tab", classes.expandButton)}
            aria-expanded={expandedRow === index}
            onClick={() => handleExpandCellClick(index)}
          >
            {original.computers.length}
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
