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
import type { AvailableVersion } from "../../../../types/AvailableVersion";
import InstancesWithoutVersionCount from "../InstancesWithoutVersionCount";
import classes from "./PackageDropdownSearchItem.module.scss";

interface PackageDropdownSearchItemProps {
  readonly selectedPackage: SelectedPackage;
  readonly onDelete: () => void;
  readonly onSelectVersion: (version: AvailableVersion) => void;
  readonly onDeselectVersion: (version: AvailableVersion) => void;
  readonly query: string;
  readonly type: "install" | "uninstall" | "hold" | "unhold";
}

const PackageDropdownSearchItem: FC<PackageDropdownSearchItemProps> = ({
  selectedPackage,
  onDelete,
  onSelectVersion,
  onDeselectVersion,
  query,
  type,
}) => {
  const { isPending, data, error } = useGetAvailablePackageVersions({
    id: selectedPackage.id,
    action: type,
    query,
  });

  if (error) {
    throw error;
  }

  const action = type.charAt(0).toUpperCase() + type.substring(1);

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
      <div className={classes.version}>
        {isPending ? (
          <LoadingState />
        ) : (
          <>
            {data.data.versions.map((packageVersion) => (
              <div key={packageVersion.name}>
                <CheckboxInput
                  labelClassName="u-no-padding--top u-no-margin--bottom"
                  label={
                    <>
                      {action} version <code>{packageVersion.name}</code> on{" "}
                      {pluralizeWithCount(
                        packageVersion.num_computers,
                        "instance",
                      )}
                    </>
                  }
                  checked={selectedPackage.versions.some(
                    (selectedVersion) =>
                      selectedVersion === packageVersion.name,
                  )}
                  onChange={({ currentTarget: { checked } }) => {
                    if (checked) {
                      onSelectVersion(packageVersion);
                    } else {
                      onDeselectVersion(packageVersion);
                    }
                  }}
                />
              </div>
            ))}

            {<InstancesWithoutVersionCount count={data.data.without_version} />}
          </>
        )}
      </div>
    </li>
  );
};

export default PackageDropdownSearchItem;
