import LoadingState from "@/components/layout/LoadingState";
import { useGetAvailablePackageVersions } from "@/features/packages";
import { pluralizeWithCount } from "@/utils/_helpers";
import {
  Button,
  CheckboxInput,
  Icon,
  ICONS,
} from "@canonical/react-components";
import classNames from "classnames";
import { type FC } from "react";
import type { SelectedPackage } from "../../../../types";
import classes from "./PackageDropdownSearchItem.module.scss";

interface PackageDropdownSearchItemProps {
  readonly selectedPackage: SelectedPackage;
  readonly onDelete: () => void;
  readonly onSelectVersion: (version: string) => void;
  readonly onDeselectVersion: (version: string) => void;
  readonly query: string;
  readonly type: "install" | "uninstall" | "hold" | "unhold";
}

const PackageDropdownSearchItem: FC<PackageDropdownSearchItemProps> = ({
  selectedPackage,
  onDelete,
  onSelectVersion,
  onDeselectVersion,
  query,
}) => {
  const { isPending, data, error } = useGetAvailablePackageVersions({
    id: selectedPackage.package.id,
    query,
  });

  if (error) {
    throw error;
  }

  return (
    <li
      className={classNames(
        "p-autocomplete__result p-list__item p-card u-no-margin--bottom",
        classes.selectedContainer,
      )}
      key={selectedPackage.package.id}
    >
      <div className={classes.topRow}>
        <h5 className="u-no-margin u-no-padding">
          {selectedPackage.package.name}
        </h5>
        <Button
          type="button"
          appearance="link"
          className="u-no-margin--bottom u-no-padding--top"
          aria-label={`Delete ${selectedPackage.package.name}`}
          onClick={onDelete}
        >
          <Icon name={ICONS.delete} />
        </Button>
      </div>
      <div className={classes.version}>
        {isPending ? (
          <LoadingState />
        ) : (
          data.data.map((packageVersion) => (
            <CheckboxInput
              key={packageVersion.name}
              label={
                <>
                  Install version <code>{packageVersion.name}</code> on{" "}
                  {pluralizeWithCount(packageVersion.num_computers, "instance")}
                </>
              }
              checked={selectedPackage.selectedVersions.includes(
                packageVersion.name,
              )}
              onChange={(checked) => {
                if (checked) {
                  onSelectVersion(packageVersion.name);
                } else {
                  onDeselectVersion(packageVersion.name);
                }
              }}
            />
          ))
        )}
      </div>
    </li>
  );
};

export default PackageDropdownSearchItem;
