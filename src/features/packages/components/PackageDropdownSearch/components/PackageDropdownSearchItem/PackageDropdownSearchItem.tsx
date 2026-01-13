import LoadingState from "@/components/layout/LoadingState";
import { useGetAvailablePackageVersions } from "@/features/packages";
import { capitalize, pluralizeWithCount } from "@/utils/_helpers";
import {
  Button,
  CheckboxInput,
  Icon,
  ICONS,
} from "@canonical/react-components";
import classNames from "classnames";
import { type FC } from "react";
import type { PackageAction, SelectedPackage } from "../../../../types";
import type { AvailableVersion } from "../../../../types/AvailableVersion";
import InstancesWithoutVersionCount from "../InstancesWithoutVersionCount";
import classes from "./PackageDropdownSearchItem.module.scss";
import { mapActionToSearch } from "../../../../helpers";

interface PackageDropdownSearchItemProps {
  readonly selectedPackage: SelectedPackage;
  readonly onDelete: () => void;
  readonly onSelectVersion: (version: AvailableVersion) => void;
  readonly onDeselectVersion: (version: AvailableVersion) => void;
  readonly query: string;
  readonly action: PackageAction;
}

const PackageDropdownSearchItem: FC<PackageDropdownSearchItemProps> = ({
  selectedPackage,
  onDelete,
  onSelectVersion,
  onDeselectVersion,
  query,
  action,
}) => {
  const { isPending, data, error } = useGetAvailablePackageVersions({
    id: selectedPackage.id,
    action: action,
    query: query,
  });

  if (error) {
    throw error;
  }

  const versions = data?.data.versions || [];

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
            {versions.map((packageVersion) => (
              <div key={packageVersion.name}>
                <CheckboxInput
                  labelClassName="u-no-padding--top u-no-margin--bottom"
                  label={
                    <>
                      {capitalize(action)}{" "}
                      {packageVersion.name ? (
                        <>version <code>{packageVersion.name}</code></>
                      ) : (
                         <>as not installed</>
                      )}
                      {" "}on {pluralizeWithCount(
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

            {
              <InstancesWithoutVersionCount
                count={data.data.out_of_scope}
                type={mapActionToSearch(action)}
              />
            }
          </>
        )}
      </div>
    </li>
  );
};

export default PackageDropdownSearchItem;
