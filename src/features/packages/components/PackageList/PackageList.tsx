import { LIST_ACTIONS_COLUMN_PROPS } from "@/components/layout/ListActions";
import LoadingState from "@/components/layout/LoadingState";
import { NO_DATA_TEXT } from "@/components/layout/NoData";
import ResponsiveTable from "@/components/layout/ResponsiveTable";
import { Tooltip } from "@/components/ui";
import useSidePanel from "@/hooks/useSidePanel";
import { Button, CheckboxInput } from "@canonical/react-components";
import type { FC } from "react";
import { lazy, Suspense, useCallback, useEffect, useMemo, useRef } from "react";
import type { CellProps, Column } from "react-table";
import type { InstancePackage } from "../../types";
import PackageListActions from "../PackageListActions";
import UbuntuProNotification from "../UbuntuProNotification";
import {
  getPackageStatusInfo,
  handleCellProps,
  isUbuntuProRequired,
} from "./helpers";
import classes from "./PackageList.module.scss";

const PackageDetails = lazy(async () => import("../PackageDetails"));

interface PackageListProps {
  readonly emptyMsg: string;
  readonly onPackagesSelect: (packages: InstancePackage[]) => void;
  readonly packages: InstancePackage[];
  readonly selectedPackages: InstancePackage[];
  readonly selectAll?: boolean;
}

const PackageList: FC<PackageListProps> = ({
  emptyMsg,
  onPackagesSelect,
  packages,
  selectedPackages,
  selectAll,
}) => {
  const selectedByTabRef = useRef(false);

  const { setSidePanelContent } = useSidePanel();

  const handleSelectPackage = useCallback(
    (pkg: InstancePackage) => {
      onPackagesSelect(
        selectedPackages.some(({ name }) => name === pkg.name)
          ? selectedPackages.filter(({ name }) => name !== pkg.name)
          : [...selectedPackages, pkg],
      );
    },
    [onPackagesSelect, selectedPackages],
  );

  const handleToggleAllPackages = useCallback(() => {
    onPackagesSelect(
      selectedPackages.length > 0
        ? []
        : packages.filter((pkg) => !isUbuntuProRequired(pkg)),
    );
  }, [onPackagesSelect, packages, selectedPackages.length]);

  useEffect(() => {
    if (!selectAll || selectedByTabRef.current || !packages.length) {
      return;
    }

    handleToggleAllPackages();
    selectedByTabRef.current = true;
  }, [selectAll, packages.length, handleToggleAllPackages]);

  const handlePackageClick = useCallback(
    (singlePackage: InstancePackage) => {
      setSidePanelContent(
        "Package details",
        <Suspense fallback={<LoadingState />}>
          <PackageDetails singlePackage={singlePackage} />
        </Suspense>,
      );
    },
    [setSidePanelContent],
  );

  const selectablePackages = useMemo(
    () => packages.filter((pkg) => !isUbuntuProRequired(pkg)),
    [packages],
  );

  const columns = useMemo<Column<InstancePackage>[]>(
    () => [
      {
        accessor: "name",
        Header: (
          <>
            <CheckboxInput
              inline
              label={<span className="u-off-screen">Toggle all</span>}
              checked={
                selectedPackages.length === packages.length &&
                packages.length > 0
              }
              indeterminate={
                selectedPackages.length < packages.length &&
                selectedPackages.length > 0
              }
              disabled={selectablePackages.length === 0}
              onChange={handleToggleAllPackages}
            />
            Name
          </>
        ),
        Cell: ({ row }: CellProps<InstancePackage>) => {
          const ubuntuProRequired = isUbuntuProRequired(row.original);
          const checkbox = (
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
              disabled={ubuntuProRequired}
            />
          );

          return (
            <>
              {ubuntuProRequired ? (
                <Tooltip message="Ubuntu Pro is required">{checkbox}</Tooltip>
              ) : (
                checkbox
              )}
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
            </>
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
        Cell: ({ row: { original } }: CellProps<InstancePackage>) =>
          original.current_version || NO_DATA_TEXT,
      },
      {
        accessor: "available_version",
        Header: "Available version",
        Cell: ({ row: { original } }: CellProps<InstancePackage>) =>
          original.available_version &&
          original.available_version !== original.current_version
            ? original.available_version
            : NO_DATA_TEXT,
      },
      {
        accessor: "summary",
        className: classes.details,
        Header: "Details",
        Cell: ({ row: { original } }: CellProps<InstancePackage>) =>
          original.summary,
      },
      {
        ...LIST_ACTIONS_COLUMN_PROPS,
        Cell: ({ row: { original } }: CellProps<InstancePackage>) => (
          <PackageListActions pkg={original} />
        ),
      },
    ],
    [
      handlePackageClick,
      handleSelectPackage,
      handleToggleAllPackages,
      packages,
      selectablePackages,
      selectedPackages,
    ],
  );

  return (
    <>
      {packages.some(isUbuntuProRequired) && <UbuntuProNotification />}
      <ResponsiveTable
        columns={columns}
        data={packages}
        getCellProps={(cell) => {
          return handleCellProps(cell);
        }}
        emptyMsg={emptyMsg}
        minWidth={1150}
      />
    </>
  );
};

export default PackageList;
