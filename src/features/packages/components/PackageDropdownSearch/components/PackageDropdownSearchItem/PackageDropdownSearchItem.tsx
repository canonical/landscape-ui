import { pluralize } from "@/utils/_helpers";
import { Button, CustomSelect, Icon, ICONS } from "@canonical/react-components";
import classNames from "classnames";
import { useState, type FC } from "react";
import type { Package } from "../../../../types";
import classes from "./PackageDropdownSearchItem.module.scss";

interface PackageDropdownSearchItemProps {
  readonly item: Package;
  readonly onDelete: () => void;
}

const PackageDropdownSearchItem: FC<PackageDropdownSearchItemProps> = ({
  item,
  onDelete,
}) => {
  const [version, setVersion] = useState("");

  const options = [
    {
      label: "Latest available version",
      value: "latest",
    },
    ...[
      ...new Set(
        item.computers
          .map(({ available_version }) => available_version)
          .filter((available_version) => available_version !== null),
      ),
    ].map((available_version) => {
      const count = item.computers.filter(
        (computer) => computer.available_version === available_version,
      ).length;

      return {
        label: (
          <div className={classes.availableVersion}>
            <span>{available_version}</span>
            <span className="u-text--muted">
              Available on {count} {pluralize(count, "instance")}
            </span>
          </div>
        ),
        text: available_version,
        value: available_version,
      };
    }),
  ];

  return (
    <li
      className={classNames(
        "p-autocomplete__result p-list__item p-card u-no-margin--bottom",
        classes.selectedContainer,
      )}
      key={item.name}
    >
      <div className={classes.topRow}>
        <h5 className="u-no-margin u-no-padding">{item.name}</h5>
        <Button
          type="button"
          appearance="link"
          className="u-no-margin--bottom"
          aria-label={`Delete ${item.name}`}
          onClick={onDelete}
        >
          <Icon name={ICONS.delete} />
        </Button>
      </div>
      <div className={classes.version}>
        <div>
          <span>Version:</span>
        </div>
        {/* TODO: Just show the version number if there's only one instance in the form */}
        <CustomSelect
          onChange={setVersion}
          value={version}
          options={options}
          toggleClassName="u-no-margin"
        />
      </div>
    </li>
  );
};

export default PackageDropdownSearchItem;
