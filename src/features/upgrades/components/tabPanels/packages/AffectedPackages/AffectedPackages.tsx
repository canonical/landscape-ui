import classNames from "classnames";
import { FC, useMemo, useState } from "react";
import { CellProps, Column } from "react-table";
import { Button, CheckboxInput } from "@canonical/react-components";
import ExpandableTable from "@/components/layout/ExpandableTable";
import LoadingState from "@/components/layout/LoadingState";
import { Package, UpgradeInstancePackagesParams } from "@/features/packages";
import { Instance } from "@/types/Instance";
import AffectedInstances from "../AffectedInstances";
import { checkIsUpdateRequired, getToggledPackage } from "../helpers";
import {
  areAllInstancesNeedToUpdate,
  areAllPackagesNeedToUpdate,
  getPackagesData,
  getToggledPackages,
  handleCellProps,
} from "./helpers";
import classes from "./AffectedPackages.module.scss";

interface AffectedPackagesProps {
  excludedPackages: UpgradeInstancePackagesParams[];
  instances: Instance[];
  isPackagesLoading: boolean;
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
  isPackagesLoading,
  onExcludedPackagesChange,
  onTableLimitChange,
  packages,
  totalPackageCount,
}) => {
  const [expandedRow, setExpandedRow] = useState(-1);

  const packagesData = useMemo(
    () => getPackagesData(packages, expandedRow, isPackagesLoading),
    [packages, expandedRow, isPackagesLoading],
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
            disabled={packagesData.length === 0}
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
          if (expandedRow !== -1 && expandedRow === index - 1) {
            return (
              <AffectedInstances
                currentPackage={original}
                excludedPackages={excludedPackages}
                onExcludedPackagesChange={onExcludedPackagesChange}
                selectedInstances={instances}
              />
            );
          }

          if (isPackagesLoading && index === packagesData.length - 1) {
            return <LoadingState />;
          }

          return original.name;
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
    [packagesData, instances, excludedPackages, expandedRow, isPackagesLoading],
  );

  return (
    <ExpandableTable
      columns={columns}
      data={packagesData}
      itemCount={packages.length}
      getCellProps={handleCellProps(
        expandedRow,
        isPackagesLoading,
        packagesData.length - 1,
      )}
      itemNames={{ plural: "packages", singular: "package" }}
      onLimitChange={onTableLimitChange}
      totalCount={totalPackageCount}
    />
  );
};

export default AffectedPackages;
