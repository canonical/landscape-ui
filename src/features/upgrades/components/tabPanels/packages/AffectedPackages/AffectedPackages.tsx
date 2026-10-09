import type { FC } from "react";
import { useCallback, useMemo } from "react";
import type { CellProps, Column } from "react-table";
import { CheckboxInput } from "@canonical/react-components";
import ExpandableTable from "@/components/layout/ExpandableTable";
import LoadingState from "@/components/layout/LoadingState";
import SelectAllButton from "@/components/layout/SelectAllButton";
import type { InstancePackagesToExclude, Package } from "@/features/packages";
import {
  checkIsPackageFullyIncluded,
  checkIsPackageUpdateRequired,
  getToggledPackage,
} from "../helpers";
import {
  checkIsUpdateRequired,
  checkIsUpdateRequiredForAllVisiblePackages,
  getPackagesData,
  getToggledPackages,
  handleCellProps,
} from "./helpers";
import classes from "./AffectedPackages.module.scss";

interface AffectedPackagesProps {
  readonly excludedPackages: InstancePackagesToExclude[];
  readonly hasNoMoreItems: boolean;
  readonly isPackagesLoading: boolean;
  readonly onExcludedPackagesChange: (
    newExcludedPackages: InstancePackagesToExclude[],
  ) => void;
  readonly onTableLimitChange: () => void;
  readonly packages: Package[];
  readonly totalPackageCount: number;
}

const AffectedPackages: FC<AffectedPackagesProps> = ({
  excludedPackages,
  hasNoMoreItems,
  isPackagesLoading,
  onExcludedPackagesChange,
  onTableLimitChange,
  packages,
  totalPackageCount,
}) => {
  const excludedPackageIdSet = useMemo(
    () =>
      new Set(
        excludedPackages.flatMap(({ exclude_packages }) => exclude_packages),
      ),
    [excludedPackages],
  );

  const showSelectAllButton = useMemo(() => {
    const packageIdSet = new Set(packages.map(({ id }) => id));

    for (const excludedPackageId of excludedPackageIdSet) {
      if (!packageIdSet.has(excludedPackageId)) {
        return true;
      }
    }

    return false;
  }, [packages, excludedPackageIdSet]);

  const packagesData = useMemo(
    () =>
      getPackagesData({
        isPackagesLoading,
        packages,
        showSelectAllButton,
      }),
    [packages, isPackagesLoading, showSelectAllButton],
  );

  const isUpdateRequired = checkIsUpdateRequired(excludedPackages, packages);

  const handleAllPackagesToggle = useCallback(() => {
    onExcludedPackagesChange(
      getToggledPackages(excludedPackages, packages, isUpdateRequired),
    );
  }, [excludedPackages, packages, isUpdateRequired, onExcludedPackagesChange]);

  const handlePackageToggle = useCallback(
    (pkg: Package) => {
      onExcludedPackagesChange(getToggledPackage(excludedPackages, pkg));
    },
    [excludedPackages, onExcludedPackagesChange],
  );

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
        Cell: ({ row: { original } }: CellProps<Package>) => {
          const isFullyIncluded = checkIsPackageFullyIncluded(
            excludedPackages,
            original,
          );
          const isPartiallyIncluded = checkIsPackageUpdateRequired(
            excludedPackages,
            original,
          );

          return (
            <CheckboxInput
              inline
              label={
                <span className="u-off-screen">
                  Toggle {original.name} package
                </span>
              }
              checked={isFullyIncluded}
              indeterminate={!isFullyIncluded && isPartiallyIncluded}
              onChange={() => {
                handlePackageToggle(original);
              }}
            />
          );
        },
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
                onClick={() => {
                  onExcludedPackagesChange(
                    excludedPackages.map(({ id }) => ({
                      id,
                      exclude_packages: [],
                    })),
                  );
                }}
                totalCount={totalPackageCount}
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
        Cell: ({ row }: CellProps<Package>) => row.original.computers.count,
      },
    ],
    [
      packagesData,
      excludedPackages,
      isPackagesLoading,
      isUpdateRequired,
      isUpdateRequiredForAllVisiblePackages,
      showSelectAllButton,
      excludedPackageIdSet,
      totalPackageCount,
      handleAllPackagesToggle,
      handlePackageToggle,
      onExcludedPackagesChange,
    ],
  );

  return (
    <ExpandableTable
      columns={columns}
      data={packagesData}
      itemCount={packages.length}
      hasNoMoreItems={hasNoMoreItems}
      getCellProps={handleCellProps({
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
