import { pluralizeWithCount } from "@/utils/_helpers";
import { Button, CustomSelect, Icon, ICONS } from "@canonical/react-components";
import classNames from "classnames";
import type { FC } from "react";
import type {
  AvailableVersion,
  DowngradeVersion,
  SelectedPackage,
  SelectedVersion,
} from "../../../../types";
import classes from "./PackageSearchDowngradeItem.module.scss";
import { useGetDowngradePackageVersions } from "@/features/packages";
import LoadingState from "@/components/layout/LoadingState";
import InstancesWithoutVersionCount from "../InstancesWithoutVersionCount";
import { mapActionToSearch } from "../../../../helpers";

interface PackageSearchDowngradeItemProps {
  readonly selectedPackage: SelectedPackage;
  readonly onDelete: () => void;
  readonly onUpdateVersions: (versions: SelectedVersion[]) => void;
  readonly query: string;
}

const PackageSearchDowngradeItem: FC<PackageSearchDowngradeItemProps> = ({
  selectedPackage,
  onDelete,
  onUpdateVersions,
  query,
}) => {
  const { isPending, data, error } = useGetDowngradePackageVersions({
    id: selectedPackage.id,
    query: query,
  });

  if (error) {
    throw error;
  }

  const versions = data?.data.versions ?? [];

  const getOptions = (downgrades: AvailableVersion[]) => {
    const defaultOption = {
      label: "Don't downgrade",
      value: "none",
    };

    if (!downgrades.length) {
      return [defaultOption];
    }

    return [
      ...downgrades.map((downgrade) => ({
        label: (
          <div className={classes.availableVersion}>
            <span>{downgrade.name}</span>
            <span className="u-text--muted">
              Available on{" "}
              {pluralizeWithCount(downgrade.num_computers, "instance")}
            </span>
          </div>
        ),
        text: downgrade.name,
        value: downgrade.name,
      })),
      {
        label: "Latest downgrade",
        value: "all",
      },
      defaultOption,
    ];
  };

  const handleSelection = (selection: string, version: DowngradeVersion) => {
    const filterOutCurrentVersion = selectedPackage.versions.filter(
      ({ source }) => source != version.name,
    );

    if (selection == "none") {
      onUpdateVersions(filterOutCurrentVersion);
    } else {
      const newTarget =
        selection == "all"
          ? version.downgrades.map((target) => ({
              name: target.name,
              source: version.name,
            }))
          : [{ name: selection, source: version.name }];

      onUpdateVersions([...filterOutCurrentVersion, ...newTarget]);
    }
  };

  const getValue = (version: DowngradeVersion) => {
    const currentTargets = selectedPackage.versions.filter(
      ({ source }) => source == version.name,
    );
    if (currentTargets.length > 1) {
      return "all";
    } else {
      const [target] = currentTargets;
      return target ? target.name : "none";
    }
  };

  return (
    <li
      className={classNames(
        "p-autocomplete__result p-list__item p-card u-no-margin--bottom",
        classes.selectedContainer,
      )}
      key={selectedPackage.id}
    >
      <div className={classes.topRow}>
        <h5 className="u-no-margin u-no-padding">{selectedPackage.name}</h5>
        <Button
          type="button"
          appearance="link"
          className="u-no-margin--bottom u-no-padding--top"
          aria-label={`Delete ${selectedPackage.name}`}
          onClick={onDelete}
        >
          <Icon name={ICONS.delete} />
        </Button>
      </div>
      {isPending ? (
        <LoadingState />
      ) : (
        <>
          {versions.map((version) => (
            <div key={version.name} className={classes.row}>
              <span>
                {pluralizeWithCount(version.num_computers, "instance")} have
                version {version.name} installed
              </span>
              <div className={classes.downgrade}>
                <span>Downgrade to:</span>
                <CustomSelect
                  onChange={(value) => {
                    handleSelection(value, version);
                  }}
                  value={getValue(version)}
                  options={getOptions(version.downgrades)}
                  searchable="never"
                  defaultToggleLabel="Select version"
                  toggleClassName="u-no-margin"
                />
              </div>
            </div>
          ))}
          <InstancesWithoutVersionCount
            count={data.data.out_of_scope}
            type={mapActionToSearch("downgrade")}
          />
        </>
      )}
    </li>
  );
};

export default PackageSearchDowngradeItem;
