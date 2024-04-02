import { FC, useEffect, useMemo, useState } from "react";
import { Package } from "@/types/Package";
import {
  Button,
  CheckboxInput,
  ModularTable,
  Tooltip,
} from "@canonical/react-components";
import { CellProps, Column } from "react-table";
import useSidePanel from "@/hooks/useSidePanel";
import PackageDetails from "@/pages/dashboard/instances/[single]/tabs/packages/PackageDetails";
import UbuntuProNotification from "@/pages/dashboard/instances/[single]/tabs/packages/UbuntuProNotification";
import { Instance } from "@/types/Instance";
import {
  getPackageStatusInfo,
  handleCellProps,
  isUbuntuProRequired,
} from "./helpers";
import classes from "./PackageList.module.scss";
import { Link } from "react-router-dom";
import { ROOT_PATH } from "@/constants";
import LoadingState from "@/components/layout/LoadingState";
import { LOADING_PACKAGE } from "./constants";

interface PackageListProps {
  emptyMsg: string;
  instance: Instance;
  onPackagesSelect: (packages: Package[]) => void;
  packages: Package[];
  packagesLoading: boolean;
  selectedPackages: Package[];
  selectAll?: boolean;
}

const PackageList: FC<PackageListProps> = ({
  emptyMsg,
  instance,
  onPackagesSelect,
  packages,
  packagesLoading,
  selectedPackages,
  selectAll,
}) => {
  const [selectedByTabState, setSelectedByTabState] = useState(false);
  const [hideUbuntuProInfo, setHideUbuntuProInfo] = useState(false);

  const { setSidePanelContent } = useSidePanel();

  const packagesToShow = useMemo(() => {
    if (!packagesLoading) {
      return packages;
    }

    return [LOADING_PACKAGE];
  }, [packages, packagesLoading]);

  const handleSelectPackage = (pkg: Package) => {
    onPackagesSelect(
      selectedPackages.some(({ name }) => name === pkg.name)
        ? selectedPackages.filter(({ name }) => name !== pkg.name)
        : [...selectedPackages, pkg],
    );
  };

  const handleToggleAllPackages = () => {
    onPackagesSelect(
      selectedPackages.length > 0
        ? []
        : packages.filter((pkg) => !isUbuntuProRequired(pkg)),
    );
  };

  useEffect(() => {
    if (!selectAll || selectedByTabState || !packages.length) {
      return;
    }

    handleToggleAllPackages();
    setSelectedByTabState(true);
  }, [selectAll, packages]);

  const handlePackageClick = (singlePackage: Package) => {
    setSidePanelContent(
      "Package details",
      <PackageDetails singlePackage={singlePackage} instanceId={instance.id} />,
    );
  };

  const columns = useMemo<Column<Package>[]>(
    () => [
      {
        accessor: "checkbox",
        className: classes.checkbox,
        Header: (
          <CheckboxInput
            inline
            label={<span className="u-off-screen">Toggle all</span>}
            checked={
              selectedPackages.length === packages.length && packages.length > 0
            }
            indeterminate={
              selectedPackages.length < packages.length &&
              selectedPackages.length > 0
            }
            disabled={packages.length === 0}
            onChange={handleToggleAllPackages}
          />
        ),
        Cell: ({ row }: CellProps<Package>) =>
          isUbuntuProRequired(row.original) ? (
            <Tooltip
              message={
                <div>
                  <p className="u-no-padding--top">Ubuntu Pro is required</p>
                  <Link
                    to={`${ROOT_PATH}instances/${instance.parent ? `${instance.parent.hostname}/${instance.hostname}` : instance.hostname}`}
                    state={{ tab: "ubuntu-pro" }}
                    className={classes.tooltipLink}
                  >
                    learn more
                  </Link>
                </div>
              }
            >
              <CheckboxInput
                inline
                disabled
                label={
                  <span className="u-off-screen">{`Toggle ${row.original.name}`}</span>
                }
                checked={selectedPackages.some(
                  ({ name }) => name === row.original.name,
                )}
                onChange={() => {
                  handleSelectPackage(row.original);
                }}
              />
            </Tooltip>
          ) : (
            <CheckboxInput
              inline
              label={
                <span className="u-off-screen">{`Toggle ${row.original.name}`}</span>
              }
              checked={selectedPackages.some(
                ({ name }) => name === row.original.name,
              )}
              onChange={() => {
                handleSelectPackage(row.original);
              }}
            />
          ),
      },
      {
        accessor: "name",
        Header: "Name",
        Cell: ({ row }: CellProps<Package>) => {
          if (row.original.name === "loading") {
            return <LoadingState />;
          }

          return (
            <Button
              type="button"
              appearance="link"
              className="u-no-margin--bottom u-no-padding--top u-align-text--left"
              onClick={() => {
                handlePackageClick(row.original);
              }}
            >
              {row.original.name}
            </Button>
          );
        },
      },
      {
        accessor: "status",
        Header: "Status",
        Cell: ({ row: { original } }: CellProps<Package>) =>
          getPackageStatusInfo(original).label,
        getCellIcon: ({ row: { original } }: CellProps<Package>) =>
          getPackageStatusInfo(original).icon,
      },
      {
        accessor: "current_version",
        Header: "Current version",
      },
      {
        accessor: "summary",
        className: classes.details,
        Header: "Details",
        Cell: ({ row: { original } }: CellProps<Package>) =>
          original.available_version ? (
            <>
              <span>{original.summary}</span>
              <br />
              <span>{`available version: ${original.available_version}`}</span>
            </>
          ) : (
            original.summary
          ),
      },
    ],
    [packages, selectedPackages.length],
  );

  return (
    <>
      {!hideUbuntuProInfo && packages.some(isUbuntuProRequired) && (
        <UbuntuProNotification
          instance={instance}
          onDismiss={() => setHideUbuntuProInfo(true)}
        />
      )}
      <ModularTable
        columns={columns}
        data={packagesToShow}
        getCellProps={handleCellProps}
        emptyMsg={emptyMsg}
      />
    </>
  );
};

export default PackageList;
