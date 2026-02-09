import ListTitle from "@/components/layout/ListTitle";
import NoData from "@/components/layout/NoData";
import ResponsiveTable from "@/components/layout/ResponsiveTable";
import ResponsiveTableSubhead from "@/components/layout/ResponsiveTableSubhead";
import { pluralizeWithCount } from "@/utils/_helpers";
import { Button, CheckboxInput } from "@canonical/react-components";
import { useCallback, useMemo, type FC } from "react";
import type { CellProps, Column } from "react-table";
import type { PackageUpgrade } from "../../types/PackageUpgrade";
import { PRIORITY_OPTIONS, SEVERITY_OPTIONS } from "../Upgrades/constants";
import classes from "./UpgradesList.module.scss";

interface UpgradesListProps {
  readonly upgradeCount: number;
  readonly currentUpgrades: PackageUpgrade[];
  readonly toggledUpgrades: PackageUpgrade[];
  readonly setToggledUpgrades: (packages: PackageUpgrade[]) => void;
  readonly enableSelectAllUpgrades: () => void;
  readonly disableSelectAllUpgrades: () => void;
  readonly isSelectAllUpgradesEnabled: boolean;
}

const UpgradesList: FC<UpgradesListProps> = ({
  currentUpgrades,
  toggledUpgrades,
  setToggledUpgrades,
  isSelectAllUpgradesEnabled,
  upgradeCount,
  enableSelectAllUpgrades,
  disableSelectAllUpgrades,
}) => {
  const compare = (upgrade1: PackageUpgrade, upgrade2: PackageUpgrade) => {
    return (
      upgrade1.name === upgrade2.name &&
      upgrade1.versions.current === upgrade2.versions.current &&
      upgrade1.versions.newest === upgrade2.versions.newest
    );
  };

  const clearSelection = () => {
    setToggledUpgrades([]);
    disableSelectAllUpgrades();
  };

  const isToggled = useCallback(
    (upgrade: PackageUpgrade) => {
      const match = (toggledUpgrade: PackageUpgrade) => {
        return compare(upgrade, toggledUpgrade);
      };

      return toggledUpgrades.some(match);
    },
    [toggledUpgrades],
  );

  const isNotToggled = useCallback(
    (upgrade: PackageUpgrade) => {
      return !isToggled(upgrade);
    },
    [isToggled],
  );

  const untoggle = useCallback(
    (...upgrades: PackageUpgrade[]) => {
      const doesNotMatchAny = (toggledUpgrade: PackageUpgrade) => {
        const doesNotMatch = (upgrade: PackageUpgrade) => {
          return !compare(upgrade, toggledUpgrade);
        };

        return upgrades.every(doesNotMatch);
      };

      const newUpgrades = toggledUpgrades.filter(doesNotMatchAny);

      setToggledUpgrades(newUpgrades);
    },
    [setToggledUpgrades, toggledUpgrades],
  );

  const untoggleAll = useCallback(() => {
    untoggle(...currentUpgrades);
  }, [currentUpgrades, untoggle]);

  const toggle = useCallback(
    (...upgrades: PackageUpgrade[]) => {
      const untoggledUpgrades = upgrades.filter(isNotToggled);

      if (
        isSelectAllUpgradesEnabled &&
        toggledUpgrades.length + untoggledUpgrades.length >= upgradeCount
      ) {
        clearSelection();
      } else {
        setToggledUpgrades([...toggledUpgrades, ...untoggledUpgrades]);
      }
    },
    [
      clearSelection,
      isNotToggled,
      isSelectAllUpgradesEnabled,
      setToggledUpgrades,
      toggledUpgrades,
      upgradeCount,
    ],
  );

  const toggleAll = useCallback(() => {
    toggle(...currentUpgrades);
  }, [currentUpgrades, toggle]);

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
              disabled={!currentUpgrades.length}
              indeterminate={
                currentUpgrades.some(isToggled) &&
                currentUpgrades.some(isNotToggled)
              }
              checked={
                isSelectAllUpgradesEnabled
                  ? currentUpgrades.every(isNotToggled)
                  : currentUpgrades.every(isToggled)
              }
              onChange={() => {
                if (
                  (isSelectAllUpgradesEnabled &&
                    currentUpgrades.every(isToggled)) ||
                  (!isSelectAllUpgradesEnabled &&
                    currentUpgrades.some(isToggled))
                ) {
                  untoggleAll();
                } else {
                  toggleAll();
                }
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
              checked={
                isSelectAllUpgradesEnabled
                  ? isNotToggled(upgradePackage)
                  : isToggled(upgradePackage)
              }
              onChange={() => {
                if (isToggled(upgradePackage)) {
                  untoggle(upgradePackage);
                } else {
                  toggle(upgradePackage);
                }
              }}
            />

            <ListTitle>
              <span>{upgradePackage.name}</span>
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
    [
      currentUpgrades,
      isSelectAllUpgradesEnabled,
      isNotToggled,
      isToggled,
      untoggleAll,
      toggleAll,
      toggle,
      untoggle,
    ],
  );

  const subhead = (isSelectAllUpgradesEnabled || !!toggledUpgrades.length) &&
    upgradeCount > currentUpgrades.length && (
      <td colSpan={5} className="u-no-padding">
        <ResponsiveTableSubhead>
          <span>
            {isSelectAllUpgradesEnabled
              ? upgradeCount - toggledUpgrades.length
              : toggledUpgrades.length}{" "}
            of {upgradeCount} instances selected
          </span>
          <Button
            className="u-no-padding u-no-margin"
            appearance="link"
            onClick={clearSelection}
          >
            Clear selection
          </Button>
          {((isSelectAllUpgradesEnabled && currentUpgrades.some(isToggled)) ||
            (!isSelectAllUpgradesEnabled &&
              currentUpgrades.some(isNotToggled))) && (
            <Button
              className="u-no-padding u-no-margin"
              appearance="link"
              onClick={() => {
                if (isSelectAllUpgradesEnabled) {
                  untoggleAll();
                } else {
                  toggleAll();
                }
              }}
            >
              Select all instances on this page
            </Button>
          )}
          {((!isSelectAllUpgradesEnabled &&
            toggledUpgrades.length < upgradeCount) ||
            (isSelectAllUpgradesEnabled && toggledUpgrades.length > 0)) && (
            <Button
              className="u-no-padding u-no-margin"
              appearance="link"
              onClick={() => {
                setToggledUpgrades([]);
                enableSelectAllUpgrades();
              }}
            >
              Select all instances on all pages
            </Button>
          )}
        </ResponsiveTableSubhead>
      </td>
    );

  return (
    <ResponsiveTable
      subhead={subhead}
      columns={columns}
      data={currentUpgrades}
      emptyMsg="No packages found according to your search parameters."
    />
  );
};

export default UpgradesList;
