import { FC, lazy, Suspense, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router";
import {
  CellProps,
  Column,
} from "@canonical/react-components/node_modules/@types/react-table";
import {
  Button,
  CheckboxInput,
  ModularTable,
  Tooltip,
} from "@canonical/react-components";
import LoadingState from "@/components/layout/LoadingState";
import { ROOT_PATH } from "@/constants";
import useSidePanel from "@/hooks/useSidePanel";
import { InstancePackage } from "../../types";
import PackageListActions from "../PackageListActions";
import UbuntuProNotification from "../UbuntuProNotification";
import { LOADING_PACKAGE } from "./constants";
import {
  getPackageStatusInfo,
  handleCellProps,
  isUbuntuProRequired,
} from "./helpers";
import classes from "./PackageList.module.scss";
import { UrlParams } from "@/types/UrlParams";

const PackageDetails = lazy(() => import("../PackageDetails"));

interface PackageListProps {
  emptyMsg: string;
  onPackagesSelect: (packages: InstancePackage[]) => void;
  packages: InstancePackage[];
  packagesLoading: boolean;
  selectedPackages: InstancePackage[];
  selectAll?: boolean;
}

const PackageList: FC<PackageListProps> = ({
  emptyMsg,
  onPackagesSelect,
  packages,
  packagesLoading,
  selectedPackages,
  selectAll,
}) => {
  const [selectedByTabState, setSelectedByTabState] = useState(false);
  const [hideUbuntuProInfo, setHideUbuntuProInfo] = useState(false);

  const { instanceId, childInstanceId } = useParams<UrlParams>();
  const { setSidePanelContent } = useSidePanel();

  const packagesToShow = useMemo(() => {
    if (!packagesLoading) {
      return packages;
    }

    return [LOADING_PACKAGE];
  }, [packages, packagesLoading]);

  const handleSelectPackage = (pkg: InstancePackage) => {
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

  const handlePackageClick = (singlePackage: InstancePackage) => {
    setSidePanelContent(
      "Package details",
      <Suspense fallback={<LoadingState />}>
        <PackageDetails singlePackage={singlePackage} />
      </Suspense>,
    );
  };

  const columns = useMemo<Column<InstancePackage>[]>(
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
        Cell: ({ row }: CellProps<InstancePackage>) =>
          isUbuntuProRequired(row.original) ? (
            <Tooltip
              message={
                <div>
                  <p className="u-no-padding--top">Ubuntu Pro is required</p>
                  <Link
                    to={`${ROOT_PATH}instances/${childInstanceId ? `${instanceId}/${childInstanceId}` : `${instanceId}`}`}
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
        Cell: ({ row }: CellProps<InstancePackage>) => {
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
        Cell: ({ row: { original } }: CellProps<InstancePackage>) =>
          getPackageStatusInfo(original).label,
        getCellIcon: ({ row: { original } }: CellProps<InstancePackage>) =>
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
        Cell: ({ row: { original } }: CellProps<InstancePackage>) =>
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
      {
        accessor: "actions",
        className: classes.actions,
        Header: "Actions",
        Cell: ({ row: { original } }: CellProps<InstancePackage>) => (
          <PackageListActions pkg={original} />
        ),
      },
    ],
    [packages, selectedPackages.length],
  );

  return (
    <>
      {!hideUbuntuProInfo && packages.some(isUbuntuProRequired) && (
        <UbuntuProNotification onDismiss={() => setHideUbuntuProInfo(true)} />
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
