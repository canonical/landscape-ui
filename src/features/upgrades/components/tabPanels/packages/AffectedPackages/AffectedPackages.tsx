import classNames from "classnames";
import { FC, useMemo, useState } from "react";
import { CellProps, Column } from "react-table";
import { Button, CheckboxInput } from "@canonical/react-components";
import ExpandableTable from "@/components/layout/ExpandableTable";
import LoadingState from "@/components/layout/LoadingState";
import SelectAllButton from "@/components/layout/SelectAllButton";
import { InstancePackagesToExclude, Package } from "@/features/packages";
import { Instance } from "@/types/Instance";
import AffectedInstances from "../AffectedInstances";
import { checkIsPackageUpdateRequired, getToggledPackage } from "../helpers";
import {
  checkIsPackageUpdateRequiredForAllInstances,
  checkIsUpdateRequired,
  checkIsUpdateRequiredForAllVisiblePackages,
  getPackagesData,
  getToggledPackages,
  handleCellProps,
} from "./helpers";
import classes from "./AffectedPackages.module.scss";

interface AffectedPackagesProps {
  excludedPackages: InstancePackagesToExclude[];
  hasNoMoreItems: boolean;
  instances: Instance[];
  isPackagesLoading: boolean;
  onExcludedPackagesChange: (
    newExcludedPackages: InstancePackagesToExclude[],
  ) => void;
  onTableLimitChange: () => void;
  packages: Package[];
  totalPackageCount: number;
}

const AffectedPackages: FC<AffectedPackagesProps> = ({
  excludedPackages,
  hasNoMoreItems,
  instances,
  isPackagesLoading,
  onExcludedPackagesChange,
  onTableLimitChange,
  packages,
  totalPackageCount,
}) => {
  const [expandedRow, setExpandedRow] = useState(-1);
  const [limit, setLimit] = useState(5);

  const excludedPackageIdSet = new Set(
    excludedPackages.flatMap(({ exclude_packages }) => exclude_packages),
  );

  const showSelectAllButton = useMemo(() => {
    const packageIdSet = new Set(packages.map(({ id }) => id));

    for (const excludedPackageId of excludedPackageIdSet) {
      if (!packageIdSet.has(excludedPackageId)) {
        return true;
      }
    }

    return false;
  }, [packages.length, excludedPackageIdSet]);

  const packagesData = useMemo(
    () =>
      getPackagesData({
        expandedRow,
        isPackagesLoading,
        packages,
        showSelectAllButton,
      }),
    [packages, expandedRow, isPackagesLoading, showSelectAllButton],
  );

  const isUpdateRequired = checkIsUpdateRequired(excludedPackages, packages);

  const handleAllPackagesToggle = () => {
    onExcludedPackagesChange(
      getToggledPackages(excludedPackages, packages, isUpdateRequired),
    );
  };

  const handlePackageToggle = (pkg: Package) => {
    onExcludedPackagesChange(getToggledPackage(excludedPackages, pkg));
  };

  const handleExpandCellClick = (index: number) => {
    setLimit(5);
    setExpandedRow((prevState) => {
      if (prevState === index) {
        return -1;
      }

      return index > prevState && prevState !== -1 ? index - 1 : index;
    });
  };

  const isUpdateRequiredForAllVisiblePackages =
    checkIsUpdateRequiredForAllVisiblePackages(excludedPackages, packages);

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
            checked={isUpdateRequiredForAllVisiblePackages}
            indeterminate={
              !isUpdateRequiredForAllVisiblePackages && isUpdateRequired
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
            checked={checkIsPackageUpdateRequiredForAllInstances(
              excludedPackages,
              original,
            )}
            indeterminate={
              !checkIsPackageUpdateRequiredForAllInstances(
                excludedPackages,
                original,
              ) && checkIsPackageUpdateRequired(excludedPackages, original)
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
          if (showSelectAllButton && index === 0) {
            return (
              <SelectAllButton
                count={totalPackageCount - excludedPackageIdSet.size}
                itemName={{ plural: "packages", singular: "package" }}
                onClick={() =>
                  onExcludedPackagesChange(
                    excludedPackages.map(({ id }) => ({
                      id,
                      exclude_packages: [],
                    })),
                  )
                }
                totalCount={totalPackageCount}
              />
            );
          }

          if (expandedRow !== -1 && expandedRow === index - 1) {
            return (
              <AffectedInstances
                currentPackage={original}
                excludedPackages={excludedPackages}
                limit={limit}
                onExcludedPackagesChange={onExcludedPackagesChange}
                onLimitChange={() => setLimit((prevState) => prevState + 5)}
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
            {new Set(original.computers.map(({ id }) => id)).size}
          </Button>
        ),
      },
    ],
    [
      packagesData,
      instances,
      excludedPackages,
      expandedRow,
      isPackagesLoading,
      limit,
    ],
  );

  return (
    <ExpandableTable
      columns={columns}
      data={packagesData}
      itemCount={packages.length}
      hasNoMoreItems={hasNoMoreItems}
      getCellProps={handleCellProps({
        expandedRow,
        isPackagesLoading,
        lastPackageIndex: packagesData.length - 1,
        showSelectAllButton,
      })}
      itemNames={{ plural: "packages", singular: "package" }}
      onLimitChange={onTableLimitChange}
      totalCount={totalPackageCount}
    />
  );
};

export default AffectedPackages;
