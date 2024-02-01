import { FC, HTMLProps, useEffect, useMemo, useState } from "react";
import { Package } from "../../../../../../types/Package";
import {
  Button,
  CheckboxInput,
  ModularTable,
  Notification,
} from "@canonical/react-components";
import {
  Cell,
  CellProps,
  Column,
  Row,
  TableCellProps,
  TableRowProps,
} from "react-table";
import classes from "./PackageList.module.scss";
import useSidePanel from "../../../../../../hooks/useSidePanel";
import PackageDetails from "./PackageDetails";
import { useNavigate } from "react-router-dom";
import { ROOT_PATH } from "../../../../../../constants";

const isUbuntuProRequired = (pkg: Package) => {
  return pkg.computers.upgrades.length > 0 && pkg.version.includes("1-2");
};

type PackageListProps = {
  emptyMsg: string;
  onPackagesSelect: (packages: Package[]) => void;
  packages: Package[];
  selectedPackages: Package[];
  selectAll?: boolean;
} & (
  | {
      short?: false;
      machineHostname: string;
    }
  | {
      short: true;
    }
);

const PackageList: FC<PackageListProps> = (props) => {
  const [hideUbuntuProInfo, setHideUbuntuProInfo] = useState(false);

  const navigate = useNavigate();
  const { setSidePanelContent } = useSidePanel();

  const packagesToShow = useMemo(() => props.packages, [props.packages]);

  useEffect(() => {
    if (!props.selectAll) {
      return;
    }

    handleToggleAllPackages();
  }, [props.selectAll, props.packages]);

  const getPackageStatusInfo = (pkg: Package) => {
    const pkgStatusInfo = {
      label: "Unknown",
      icon: "",
    };

    if (props.short) {
      return pkgStatusInfo;
    }

    if (pkg.computers.upgrades.length > 0) {
      pkgStatusInfo.label = pkg.usn ? "Security upgrade" : "Regular upgrade";
      pkgStatusInfo.icon = pkg.usn
        ? "status-failed-small"
        : "status-waiting-small";
    } else if (pkg.computers.held.length > 0) {
      pkgStatusInfo.label = "Held";
      pkgStatusInfo.icon = "status-in-progress-small";
    } else if (pkg.computers.installed.length > 0) {
      pkgStatusInfo.label = "Installed";
      pkgStatusInfo.icon = "status-succeeded-small";
    } else if (pkg.computers.available.length > 0) {
      pkgStatusInfo.label = "Available";
      pkgStatusInfo.icon = "status-queued-small";
    }

    return pkgStatusInfo;
  };

  const handleSelectPackage = (pkg: Package) => {
    props.onPackagesSelect(
      props.selectedPackages.some(
        ({ name, version }) => name === pkg.name && version === pkg.version,
      )
        ? props.selectedPackages.filter(
            ({ name, version }) =>
              !(name === pkg.name && version === pkg.version),
          )
        : [...props.selectedPackages, pkg],
    );
  };

  const handleToggleAllPackages = () => {
    props.onPackagesSelect(
      props.selectedPackages.length > 0
        ? []
        : props.packages.filter((pkg) => !isUbuntuProRequired(pkg)),
    );
  };

  const handlePackageClick = (singlePackage: Package) => {
    if (props.short) {
      return;
    }

    setSidePanelContent(
      "Package details",
      <PackageDetails
        singlePackage={singlePackage}
        query={`hostname:${props.machineHostname}`}
      />,
    );
  };

  const columns = useMemo<Column<Package>[]>(
    () =>
      [
        {
          accessor: "checkbox",
          className: classes.checkbox,
          Header: (
            <CheckboxInput
              inline
              label={<span className="u-off-screen">Toggle all</span>}
              checked={
                props.selectedPackages.length === props.packages.length &&
                props.packages.length > 0
              }
              indeterminate={
                props.selectedPackages.length < props.packages.length &&
                props.selectedPackages.length > 0
              }
              disabled={props.packages.length === 0}
              onChange={handleToggleAllPackages}
            />
          ),
          Cell: ({ row }: CellProps<Package>) => (
            <CheckboxInput
              inline
              disabled={isUbuntuProRequired(row.original)}
              label={<span className="u-off-screen">{row.original.name}</span>}
              checked={props.selectedPackages.some(
                ({ name, version }) =>
                  name === row.original.name &&
                  version === row.original.version,
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
          Cell: ({ row }: CellProps<Package>) =>
            props.short ? (
              <>
                <span>{row.original.name}</span>
                <br />
                <span>{`v${row.original.version}`}</span>
              </>
            ) : (
              <Button
                type="button"
                appearance="link"
                className="u-no-margin--bottom u-no-padding--top u-align-text--left"
                disabled={isUbuntuProRequired(row.original)}
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
          Cell: ({ row }: CellProps<Package>) => {
            const status = getPackageStatusInfo(row.original).label;
            if (status !== "Security upgrade") {
              return status;
            }

            return (
              <>
                <span>{status}</span>
                <Button
                  type="button"
                  appearance="link"
                  className="u-no-margin--bottom u-no-padding--top u-align-text--left"
                  onClick={() => {}}
                >
                  {`${row.original.usn?.name}, ${row.original.usn?.summary}`}
                </Button>
              </>
            );
          },
          getCellIcon: ({ row }: CellProps<Package>) =>
            getPackageStatusInfo(row.original).icon,
        },
        {
          accessor: "version",
          Header: "Current version",
        },
        {
          accessor: "summary",
          className: props.short ? undefined : classes.details,
          Header: "Details",
          Cell: ({ row }: CellProps<Package>) =>
            row.original.computers.upgrades.length > 0 ? (
              <>
                <div>{row.original.summary}</div>
                <span>{`from: to: ${row.original.version}`}</span>
              </>
            ) : (
              row.original.summary
            ),
        },
      ].filter(
        ({ accessor }) =>
          !props.short || (accessor !== "status" && accessor !== "version"),
      ),
    [props.packages, props.selectedPackages.length, props.short],
  );

  const handleCellProps = ({ column, row }: Cell<Package>) => {
    const cellProps: Partial<TableCellProps & HTMLProps<HTMLTableCellElement>> =
      {};

    if (column.id === "checkbox") {
      cellProps["aria-label"] = `Toggle ${row.original.name} package`;
    } else if (column.id === "name") {
      cellProps.role = "rowheader";
    } else if (column.id === "status") {
      cellProps["aria-label"] = "Status";
    } else if (column.id === "version") {
      cellProps["aria-label"] = "Current version";
    } else if (column.id === "summary") {
      cellProps["aria-label"] = "Details";
    }

    return cellProps;
  };

  const handleRowProps = ({
    original,
  }: Row<Package>): Partial<TableRowProps & HTMLProps<HTMLTableRowElement>> => {
    if (isUbuntuProRequired(original)) {
      return { className: classes.disabledRow };
    }
    return {};
  };

  return (
    <>
      {!hideUbuntuProInfo &&
        !props.short &&
        props.packages.some(isUbuntuProRequired) && (
          <Notification
            severity="caution"
            onDismiss={() => {
              setHideUbuntuProInfo(true);
            }}
          >
            <strong>Some upgrades require Ubuntu Pro: </strong>
            <span>
              Your current Ubuntu package upgrades are limited. To unlock full
              upgrades, please upgrade to Ubuntu Pro.{" "}
            </span>
            <Button
              type="button"
              appearance="link"
              onClick={() => {
                navigate(`${ROOT_PATH}machines/${props.machineHostname}`, {
                  state: { tab: "ubuntu-pro" },
                });
              }}
            >
              Learn more
            </Button>
          </Notification>
        )}
      <ModularTable
        columns={columns}
        data={packagesToShow}
        getCellProps={handleCellProps}
        getRowProps={handleRowProps}
        emptyMsg={props.emptyMsg}
      />
    </>
  );
};

export default PackageList;
