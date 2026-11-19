import LoadingState from "@/components/layout/LoadingState";
import { NO_DATA_TEXT } from "@/components/layout/NoData";
import ResponsiveTable from "@/components/layout/ResponsiveTable";
import type { InstancePackage } from "@/features/packages";
import {
  getPackageListCellProps,
  getPackageStatusInfo,
  isUbuntuProRequired,
  UbuntuProNotification,
} from "@/features/packages";
import useSidePanel from "@/hooks/useSidePanel";
import { Button } from "@canonical/react-components";
import type { FC } from "react";
import { lazy, Suspense, useCallback, useMemo, useState } from "react";
import type { CellProps, Column } from "react-table";
import classes from "./SupportInstancePackageList.module.scss";

const SupportInstancePackageDetails = lazy(
  async () => import("./SupportInstancePackageDetails"),
);

interface SupportInstancePackageListProps {
  readonly packages: InstancePackage[];
  readonly emptyMsg: string;
  readonly ubuntuProPath: string;
}

const SupportInstancePackageList: FC<SupportInstancePackageListProps> = ({
  packages,
  emptyMsg,
  ubuntuProPath,
}) => {
  const [hideUbuntuProInfo, setHideUbuntuProInfo] = useState(false);
  const { setSidePanelContent } = useSidePanel();

  const handlePackageClick = useCallback(
    (singlePackage: InstancePackage) => {
      setSidePanelContent(
        "Package details",
        <Suspense fallback={<LoadingState />}>
          <SupportInstancePackageDetails singlePackage={singlePackage} />
        </Suspense>,
      );
    },
    [setSidePanelContent],
  );

  const columns = useMemo<Column<InstancePackage>[]>(
    () => [
      {
        accessor: "name",
        Header: "Name",
        Cell: ({ row }: CellProps<InstancePackage>) => (
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
        ),
      },
      {
        accessor: "status",
        Header: "Status",
        Cell: ({ row: { original: pkg } }: CellProps<InstancePackage>) =>
          getPackageStatusInfo(pkg).label,
        getCellIcon: ({ row: { original: pkg } }: CellProps<InstancePackage>) =>
          getPackageStatusInfo(pkg).icon,
      },
      {
        accessor: "current_version",
        Header: "Current version",
        Cell: ({ row: { original: pkg } }: CellProps<InstancePackage>) =>
          pkg.current_version || NO_DATA_TEXT,
      },
      {
        accessor: "available_version",
        Header: "Available version",
        Cell: ({ row: { original: pkg } }: CellProps<InstancePackage>) =>
          pkg.available_version && pkg.available_version !== pkg.current_version
            ? pkg.available_version
            : NO_DATA_TEXT,
      },
      {
        accessor: "summary",
        className: classes.details,
        Header: "Details",
        Cell: ({ row: { original: pkg } }: CellProps<InstancePackage>) =>
          pkg.summary,
      },
    ],
    [handlePackageClick],
  );

  return (
    <>
      {!hideUbuntuProInfo && packages.some(isUbuntuProRequired) && (
        <UbuntuProNotification
          learnMorePath={ubuntuProPath}
          onDismiss={() => {
            setHideUbuntuProInfo(true);
          }}
        />
      )}
      <ResponsiveTable
        columns={columns}
        data={packages}
        getCellProps={getPackageListCellProps}
        emptyMsg={emptyMsg}
        minWidth={1000}
      />
    </>
  );
};

export default SupportInstancePackageList;
