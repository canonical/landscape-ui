import ResponsiveTable from "@/components/layout/ResponsiveTable";
import ResponsiveTableSubhead from "@/components/layout/ResponsiveTableSubhead";
import { CheckboxInput } from "@canonical/react-components";
import { useCallback, useMemo, type FC } from "react";
import type { CellProps, Column } from "react-table";
import classes from "./UpgradesList.module.scss";
import type { Package } from "@/features/packages";
import { pluralize } from "@/utils/_helpers";

interface UpgradesListProps {
  readonly upgradeCount: number;
  readonly currentUpgrades: Package[];
  readonly selectedUpgrades: Package[];
  readonly setSelectedUpgrades: (packages: Package[]) => void;
}

const UpgradesList: FC<UpgradesListProps> = ({
  currentUpgrades,
  selectedUpgrades,
  setSelectedUpgrades,
  upgradeCount,
}) => {
  const compare = (upgrade1: Package, upgrade2: Package) => {
    return upgrade1.id === upgrade2.id;
  };

  const clearSelection = useCallback(() => {
    setSelectedUpgrades([]);
  }, [setSelectedUpgrades]);

  const isSelected = useCallback(
    (upgrade: Package) => {
      const match = (toggledUpgrade: Package) => {
        return compare(upgrade, toggledUpgrade);
      };

      return selectedUpgrades.some(match);
    },
    [selectedUpgrades],
  );

  const isNotSelected = useCallback(
    (upgrade: Package) => {
      return !isSelected(upgrade);
    },
    [isSelected],
  );

  const deselect = useCallback(
    (...upgrades: Package[]) => {
      const doesNotMatchAny = (toggledUpgrade: Package) => {
        const doesNotMatch = (upgrade: Package) => {
          return !compare(upgrade, toggledUpgrade);
        };

        return upgrades.every(doesNotMatch);
      };

      const newUpgrades = selectedUpgrades.filter(doesNotMatchAny);

      setSelectedUpgrades(newUpgrades);
    },
    [setSelectedUpgrades, selectedUpgrades],
  );

  const deselectAll = useCallback(() => {
    deselect(...currentUpgrades);
  }, [currentUpgrades, deselect]);

  const select = useCallback(
    (...upgrades: Package[]) => {
      const untoggledUpgrades = upgrades.filter(isNotSelected);

      setSelectedUpgrades([...selectedUpgrades, ...untoggledUpgrades]);
    },
    [isNotSelected, setSelectedUpgrades, selectedUpgrades],
  );

  const selectAll = useCallback(() => {
    select(...currentUpgrades);
  }, [currentUpgrades, select]);

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
                currentUpgrades.some(isSelected) &&
                currentUpgrades.some(isNotSelected)
              }
              checked={
                currentUpgrades.every(isSelected) && !!currentUpgrades.length
              }
              onChange={() => {
                if (currentUpgrades.some(isSelected)) {
                  deselectAll();
                } else {
                  selectAll();
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
              checked={isSelected(upgradePackage)}
              onChange={() => {
                if (isSelected(upgradePackage)) {
                  deselect(upgradePackage);
                } else {
                  select(upgradePackage);
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
        accessor: "computers",
        Header: "Affected instances",
        Cell: ({ row: { original: upgradePackage } }: CellProps<Package>) =>
          pluralize(upgradePackage.computers.count, ["instance"], "exact"),
      },
      {
        accessor: "summary",
        Header: "Description",
      },
    ],
    [
      currentUpgrades,
      isNotSelected,
      isSelected,
      deselectAll,
      selectAll,
      select,
      deselect,
    ],
  );

  const subhead = !!selectedUpgrades.length &&
    upgradeCount > currentUpgrades.length && (
      <td colSpan={5} className="u-no-padding">
        <ResponsiveTableSubhead
          itemName="package"
          onClearSelection={clearSelection}
          selectedCount={selectedUpgrades.length}
          totalCount={upgradeCount}
        />
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
