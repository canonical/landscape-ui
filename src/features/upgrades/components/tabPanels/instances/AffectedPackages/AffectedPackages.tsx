import { FC, useMemo } from "react";
import { CellProps, Column } from "react-table";
import { CheckboxInput } from "@canonical/react-components";
import ExpandableTable from "@/components/layout/ExpandableTable";
import LoadingState from "@/components/layout/LoadingState";
import SelectAllButton from "@/components/layout/SelectAllButton";
import {
  InstancePackage,
  InstancePackagesToExclude,
} from "@/features/packages";
import { Instance } from "@/types/Instance";
import { getPackageData, handleCellProps } from "./helpers";

interface AffectedPackagesProps {
  excludedPackages: InstancePackagesToExclude[];
  instance: Instance;
  onExcludedPackagesChange: (
    newExcludedPackages: InstancePackagesToExclude[],
  ) => void;
  onLimitChange: () => void;
  packages: InstancePackage[];
  packagesCount: number;
  packagesLoading: boolean;
}

const AffectedPackages: FC<AffectedPackagesProps> = ({
  excludedPackages,
  instance,
  onExcludedPackagesChange,
  onLimitChange,
  packages,
  packagesCount,
  packagesLoading,
}) => {
  const instanceExcludedPackages =
    excludedPackages.find(({ id }) => id === instance.id)?.exclude_packages ??
    [];

  const showSelectAllButton = useMemo(() => {
    const packageIdSet = new Set(packages.map(({ id }) => id));

    return (
      instanceExcludedPackages.length > 0 &&
      instanceExcludedPackages.some((id) => !packageIdSet.has(id))
    );
  }, [instanceExcludedPackages.length, packages]);

  const packageData = useMemo(
    () => getPackageData(packages, showSelectAllButton, packagesLoading),
    [packages, showSelectAllButton, packagesLoading],
  );

  const toggleAllPackages = () => {
    const packageIds = packages.map(({ id }) => id);

    onExcludedPackagesChange(
      excludedPackages.map(({ id, exclude_packages }) => {
        if (id !== instance.id) {
          return { id, exclude_packages };
        }

        return {
          id,
          exclude_packages:
            exclude_packages.length < packageIds.length ? packageIds : [],
        };
      }),
    );
  };

  const togglePackage = (pkgId: number) => {
    onExcludedPackagesChange(
      excludedPackages.map(({ id, exclude_packages }) => {
        if (id !== instance.id) {
          return { id, exclude_packages };
        }

        return {
          id,
          exclude_packages: exclude_packages.includes(pkgId)
            ? exclude_packages.filter((packageId) => packageId !== pkgId)
            : [...exclude_packages, pkgId],
        };
      }),
    );
  };

  const columns = useMemo<Column<InstancePackage>[]>(
    () => [
      {
        accessor: "checkbox",
        className: "checkbox-column",
        Header: (
          <CheckboxInput
            inline
            label={<span className="u-off-screen">Toggle all packages</span>}
            disabled={packageData.length === 0}
            checked={instanceExcludedPackages.length === 0}
            indeterminate={
              instanceExcludedPackages.length > 0 &&
              packages.some(({ id }) => !instanceExcludedPackages.includes(id))
            }
            onChange={toggleAllPackages}
          />
        ),
        Cell: ({ row: { index, original } }: CellProps<InstancePackage>) => {
          if (packagesLoading && index === packageData.length - 1) {
            return <LoadingState />;
          }

          if (index === 0 && showSelectAllButton) {
            return (
              <SelectAllButton
                count={packagesCount - instanceExcludedPackages.length}
                itemName={{ plural: "packages", singular: "package" }}
                onClick={() =>
                  onExcludedPackagesChange(
                    excludedPackages.map(({ id, exclude_packages }) => ({
                      id,
                      exclude_packages:
                        id !== instance.id ? exclude_packages : [],
                    })),
                  )
                }
                totalCount={packagesCount}
              />
            );
          }

          return (
            <CheckboxInput
              inline
              label={
                <span className="u-off-screen">
                  Toggle {original.name} package
                </span>
              }
              checked={!instanceExcludedPackages.includes(original.id)}
              onChange={() => togglePackage(original.id)}
            />
          );
        },
      },
      {
        accessor: "name",
        Header: "Name",
      },
      {
        accessor: "current_version",
        Header: "Current version",
      },
      {
        accessor: "available_version",
        Header: "New version",
      },
      {
        accessor: "summary",
        Header: "Details",
      },
    ],
    [packageData.length, packagesLoading, instanceExcludedPackages.length],
  );

  return packagesLoading && !packages.length ? (
    <LoadingState />
  ) : (
    <ExpandableTable
      columns={columns}
      data={packageData}
      itemCount={packages.length}
      itemNames={{ plural: "packages", singular: "package" }}
      onLimitChange={onLimitChange}
      totalCount={packagesCount}
      title={
        <p className="p-heading--4">
          Packages affected on <b>{instance.title}</b>
        </p>
      }
      getCellProps={handleCellProps({
        lastPackageIndex: packageData.length - 1,
        loading: packagesLoading,
        showToggle: showSelectAllButton,
      })}
    />
  );
};

export default AffectedPackages;
