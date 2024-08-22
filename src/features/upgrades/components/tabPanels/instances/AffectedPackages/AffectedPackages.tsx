import { FC, useMemo } from "react";
import { CellProps, Column } from "react-table";
import { CheckboxInput } from "@canonical/react-components";
import ExpandableTable from "@/components/layout/ExpandableTable";
import LoadingState from "@/components/layout/LoadingState";
import {
  InstancePackage,
  UpgradeInstancePackagesParams,
} from "@/features/packages";
import { Instance } from "@/types/Instance";
import SelectAllButton from "../SelectAllButton";
import { handleCellProps } from "./helpers";

interface AffectedPackagesProps {
  excludedPackages: UpgradeInstancePackagesParams[];
  instance: Instance;
  onExcludedPackagesChange: (
    newExcludedPackages: UpgradeInstancePackagesParams[],
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
    const packageNames = [...new Set(packages.map(({ name }) => name))];

    return (
      instanceExcludedPackages.length > 0 &&
      instanceExcludedPackages.some((name) => !packageNames.includes(name))
    );
  }, [instanceExcludedPackages.length, packages]);

  const packageData = useMemo(
    () => (showSelectAllButton ? [packages[0], ...packages] : packages),
    [packages, instanceExcludedPackages.length],
  );

  const toggleAllPackages = () => {
    const packageNames = [...new Set(packages.map(({ name }) => name))];

    onExcludedPackagesChange(
      excludedPackages.map(({ id, exclude_packages }) => {
        if (id !== instance.id) {
          return { id, exclude_packages };
        }

        return {
          id,
          exclude_packages:
            exclude_packages.length < packageNames.length ? packageNames : [],
        };
      }),
    );
  };

  const togglePackage = (name: string) => {
    onExcludedPackagesChange(
      excludedPackages.map(({ id, exclude_packages }) => {
        if (id !== instance.id) {
          return { id, exclude_packages };
        }

        return {
          id,
          exclude_packages: exclude_packages.includes(name)
            ? exclude_packages.filter((packageName) => packageName !== name)
            : [...exclude_packages, name],
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
              packages.some(
                ({ name }) => !instanceExcludedPackages.includes(name),
              )
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
              checked={!instanceExcludedPackages.includes(original.name)}
              onChange={() => togglePackage(original.name)}
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

  return packagesLoading ? (
    <LoadingState />
  ) : (
    <ExpandableTable
      columns={columns}
      data={packageData}
      itemNames={{ plural: "packages", singular: "package" }}
      onLimitChange={onLimitChange}
      totalCount={packagesCount}
      title={
        <p className="p-heading--4">
          Packages affected on <b>{instance.title}</b>
        </p>
      }
      getCellProps={handleCellProps({
        loading: packagesLoading,
        showToggle: showSelectAllButton,
      })}
    />
  );
};

export default AffectedPackages;
