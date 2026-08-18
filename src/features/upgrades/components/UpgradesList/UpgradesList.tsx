import ResponsiveTable from "@/components/layout/ResponsiveTable";
import ResponsiveTableSubhead from "@/components/layout/ResponsiveTableSubhead";
import { Button, CheckboxInput } from "@canonical/react-components";
import { useCallback, useMemo, type FC } from "react";
import type { CellProps, Column } from "react-table";
import AffectedInstancesLink from "../AffectedInstancesLink";
import classes from "./UpgradesList.module.scss";
import type { Package } from "@/features/packages";

interface UpgradesListProps {
  readonly upgradeCount: number;
  readonly currentUpgrades: Package[];
  readonly toggledUpgrades: Package[];
  readonly setToggledUpgrades: (packages: Package[]) => void;
  readonly enableSelectAllUpgrades: () => void;
  readonly disableSelectAllUpgrades: () => void;
  readonly isSelectAllUpgradesEnabled: boolean;
  readonly query?: string;
}

const UpgradesList: FC<UpgradesListProps> = ({
  currentUpgrades,
  toggledUpgrades,
  setToggledUpgrades,
  isSelectAllUpgradesEnabled,
  upgradeCount,
  enableSelectAllUpgrades,
  disableSelectAllUpgrades,
  query,
}) => {
  const compare = (upgrade1: Package, upgrade2: Package) => {
    return upgrade1.id === upgrade2.id;
  };

  const clearSelection = useCallback(() => {
    setToggledUpgrades([]);
    disableSelectAllUpgrades();
  }, [disableSelectAllUpgrades, setToggledUpgrades]);

  const isToggled = useCallback(
    (upgrade: Package) => {
      const match = (toggledUpgrade: Package) => {
        return compare(upgrade, toggledUpgrade);
      };

      return toggledUpgrades.some(match);
    },
    [toggledUpgrades],
  );

  const isNotToggled = useCallback(
    (upgrade: Package) => {
      return !isToggled(upgrade);
    },
    [isToggled],
  );

  const untoggle = useCallback(
    (...upgrades: Package[]) => {
      const doesNotMatchAny = (toggledUpgrade: Package) => {
        const doesNotMatch = (upgrade: Package) => {
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
    (...upgrades: Package[]) => {
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
              disabled={!currentUpgrades.length}
              indeterminate={
                currentUpgrades.some(isToggled) &&
                currentUpgrades.some(isNotToggled)
              }
              checked={
                isSelectAllUpgradesEnabled
                  ? currentUpgrades.every(isNotToggled)
                  : currentUpgrades.every(isToggled) && !!currentUpgrades.length
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
            Package
          </div>
        ),
        Cell: ({ row: { original: upgradePackage } }: CellProps<Package>) => (
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
            {upgradePackage.name}
          </div>
        ),
      },
      {
        accessor: "version",
        Header: "Upgrade version",
        Cell: ({ row: { original: upgradePackage } }: CellProps<Package>) =>
          upgradePackage.version,
      },
      {
        Header: "Upgrade type",
      },
      {
        accessor: "computers",
        Header: "Affected instances",
        Cell: ({ row: { original: upgradePackage } }: CellProps<Package>) => (
          <AffectedInstancesLink upgrade={upgradePackage} query={query} />
        ),
      },
      {
        accessor: "summary",
        Header: "Description",
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
      query,
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
            of {upgradeCount} packages selected
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
              Select all packages on this page
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
              Select all packages on all pages
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
