import ListTitle from "@/components/layout/ListTitle";
import ResponsiveTable from "@/components/layout/ResponsiveTable";
import type { Package } from "@/features/packages";
import useSelection from "@/hooks/useSelection";
import { pluralizeWithCount } from "@/utils/_helpers";
import { CheckboxInput } from "@canonical/react-components";
import { useMemo, type FC } from "react";
import type { CellProps, Column } from "react-table";
import classes from "./UpgradesList.module.scss";

interface UpgradesListProps {
  readonly packages: Package[];
}

const UpgradesList: FC<UpgradesListProps> = ({ packages }) => {
  const {
    selectedItems: selectedPackages,
    setSelectedItems: setSelectedPackages,
  } = useSelection(packages);

  const columns = useMemo<Column<Package>[]>(
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
        Cell: ({ row: { original: pkg } }: CellProps<Package>) => (
          <div className={classes.rowHeader}>
            <CheckboxInput
              inline
              label={<span className="u-off-screen">Select {pkg.name}</span>}
              labelClassName="u-no-padding"
              checked={selectedPackages.includes(pkg)}
              onChange={({ currentTarget: { checked } }) => {
                setSelectedPackages(
                  checked
                    ? [...selectedPackages, pkg]
                    : selectedPackages.filter((i) => i !== pkg),
                );
              }}
            />

            <ListTitle>
              {pkg.name}
              <span className="u-text--muted">{pkg.summary}</span>
            </ListTitle>
          </div>
        ),
      },
      {
        accessor: "version",
        Header: (
          <div className={classes.stacked}>
            Newest version
            <span className="u-text--muted">Current version</span>
          </div>
        ),
        Cell: () => (
          <div className={classes.stacked}>
            2.4.6
            <span className="u-text--muted">2.3.0</span>
          </div>
        ),
      },
      {
        accessor: "instances",
        Header: (
          <div className={classes.stacked}>
            Affected instances
            <span className="u-text--muted">OS</span>
          </div>
        ),
        Cell: () => (
          <div className={classes.stacked}>
            {pluralizeWithCount(10000, "instance")}
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
        Cell: () => (
          <div className={classes.stacked}>
            3809-2
            <span className="u-text--muted">CVE-2021-3733</span>
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
        Cell: () => (
          <div className={classes.stacked}>
            Critical
            <span className="u-text--muted">Critical</span>
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
      emptyMsg="No Windows instances found according to your search parameters."
    />
  );
};

export default UpgradesList;
