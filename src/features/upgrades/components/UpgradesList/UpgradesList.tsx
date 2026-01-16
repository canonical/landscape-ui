import ListTitle from "@/components/layout/ListTitle";
import NoData from "@/components/layout/NoData";
import ResponsiveTable from "@/components/layout/ResponsiveTable";
import { pluralizeWithCount } from "@/utils/_helpers";
import { Button, CheckboxInput } from "@canonical/react-components";
import { useMemo, type FC } from "react";
import type { CellProps, Column } from "react-table";
import type { PackageUpgrade } from "../../types/PackageUpgrade";
import { PRIORITY_OPTIONS, SEVERITY_OPTIONS } from "../Upgrades/constants";
import classes from "./UpgradesList.module.scss";

interface UpgradesListProps {
  readonly packages: PackageUpgrade[];
  readonly selectedPackages: PackageUpgrade[];
  readonly setSelectedPackages: (packages: PackageUpgrade[]) => void;
}

const UpgradesList: FC<UpgradesListProps> = ({
  packages,
  selectedPackages,
  setSelectedPackages,
}) => {
  const columns = useMemo<Column<PackageUpgrade>[]>(
    () => [
      {
        accessor: "name",
        Header: (
          <div className={classes.rowHeader}>
            <CheckboxInput
              label={<span className="u-off-screen">Toggle all packages</span>}
              labelClassName="u-no-padding"
              inline
              disabled={!packages.length}
              indeterminate={
                !!selectedPackages.length &&
                selectedPackages.length < packages.length
              }
              checked={
                !!packages.length && selectedPackages.length === packages.length
              }
              onChange={({ currentTarget: { checked } }) => {
                setSelectedPackages(checked ? packages : []);
              }}
            />
            <div className={classes.stacked}>
              Package name
              <span className="u-text--muted">Details</span>
            </div>
          </div>
        ),
        Cell: ({
          row: { original: upgradePackage },
        }: CellProps<PackageUpgrade>) => (
          <div className={classes.rowHeader}>
            <CheckboxInput
              inline
              label={
                <span className="u-off-screen">
                  Select {upgradePackage.name}
                </span>
              }
              labelClassName="u-no-padding"
              checked={selectedPackages.includes(upgradePackage)}
              onChange={({ currentTarget: { checked } }) => {
                setSelectedPackages(
                  checked
                    ? [...selectedPackages, upgradePackage]
                    : selectedPackages.filter((i) => i !== upgradePackage),
                );
              }}
            />

            <ListTitle>
              {upgradePackage.name}
              <span className="u-text--muted">{upgradePackage.details}</span>
            </ListTitle>
          </div>
        ),
      },
      {
        accessor: "versions",
        Header: (
          <div className={classes.stacked}>
            Newest version
            <span className="u-text--muted">Current version</span>
          </div>
        ),
        Cell: ({
          row: { original: upgradePackage },
        }: CellProps<PackageUpgrade>) => (
          <div className={classes.stacked}>
            {upgradePackage.versions.newest}
            <span className="u-text--muted">
              {upgradePackage.versions.current}
            </span>
          </div>
        ),
      },
      {
        accessor: "affected_instance_count",
        Header: (
          <div className={classes.stacked}>
            Affected instances
            <span className="u-text--muted">OS</span>
          </div>
        ),
        Cell: ({
          row: { original: upgradePackage },
        }: CellProps<PackageUpgrade>) => (
          <div className={classes.stacked}>
            <Button
              className="u-no-padding--top u-no-margin--bottom u-align-text--left"
              appearance="link"
            >
              {pluralizeWithCount(
                upgradePackage.affected_instance_count,
                "instance",
              )}
            </Button>
            <span className="u-text--muted">Ubuntu 22.04</span>
          </div>
        ),
      },
      {
        accessor: "usn",
        Header: (
          <div className={classes.stacked}>
            USN
            <span className="u-text--muted">CVE</span>
          </div>
        ),
        Cell: ({
          row: { original: upgradePackage },
        }: CellProps<PackageUpgrade>) => (
          <div className={classes.stacked}>
            {upgradePackage.usn ? (
              <a
                href={`https://ubuntu.com/security/notices/USN-${upgradePackage.usn}`}
                target="_blank"
                rel="nofollow noopener noreferrer"
              >
                {upgradePackage.usn}
              </a>
            ) : (
              <NoData />
            )}
            {upgradePackage.cve ? (
              <a
                href={`https://ubuntu.com/security/CVE-${upgradePackage.cve}`}
                target="_blank"
                rel="nofollow noopener noreferrer"
              >
                CVE-{upgradePackage.cve}
              </a>
            ) : (
              <span className="u-text--muted">
                <NoData />
              </span>
            )}
          </div>
        ),
      },
      {
        accessor: "severity",
        Header: (
          <div className={classes.stacked}>
            Severity
            <span className="u-text--muted">Priority</span>
          </div>
        ),
        Cell: ({
          row: { original: upgradePackage },
        }: CellProps<PackageUpgrade>) => (
          <div className={classes.stacked}>
            {upgradePackage.severity ? (
              SEVERITY_OPTIONS.find(
                (option) => option.value === upgradePackage.severity,
              )?.label || upgradePackage.severity
            ) : (
              <NoData />
            )}
            <span className="u-text--muted">
              {upgradePackage.priority ? (
                PRIORITY_OPTIONS.find(
                  (option) => option.value === upgradePackage.priority,
                )?.label || upgradePackage.priority
              ) : (
                <NoData />
              )}
            </span>
          </div>
        ),
      },
    ],
    [packages, selectedPackages, setSelectedPackages],
  );

  return (
    <ResponsiveTable
      columns={columns}
      data={packages}
      emptyMsg="No packages found according to your search parameters."
    />
  );
};

export default UpgradesList;
