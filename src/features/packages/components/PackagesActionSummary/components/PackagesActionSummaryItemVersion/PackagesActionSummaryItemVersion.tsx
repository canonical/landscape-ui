import { pluralizeWithCount } from "@/utils/_helpers";
import { Button } from "@canonical/react-components";
import type { FC } from "react";
import { useBoolean } from "usehooks-ts";
import type {
  AvailableVersion,
  PackageAction,
  SelectedPackage,
} from "../../../../types";
import classes from "../PackagesActionSummaryItem/PackagesActionSummaryItem.module.scss";
import PackagesActionSummaryDetails from "../PackagesActionSummaryDetails";

interface PackagesActionSummaryItemVersionProps {
  readonly action: PackageAction;
  readonly instanceIds: number[];
  readonly selectedPackage: SelectedPackage;
  readonly version: AvailableVersion;
}

const PackagesActionSummaryItemVersion: FC<
  PackagesActionSummaryItemVersionProps
> = ({ action, instanceIds, selectedPackage, version }) => {
  const {
    value: isModalOpen,
    setTrue: openModal,
    setFalse: closeModal,
  } = useBoolean();

  return (
    <div className={classes.row} key={version.name}>
      <Button
        type="button"
        appearance="link"
        className={classes.instances}
        onClick={openModal}
      >
        {pluralizeWithCount(version.num_computers, "instance")}
      </Button>
      <span>
        Will {action}{" "}
        {version.name ? (
          <code>{selectedPackage.name} {version.name}</code>
        ) : (
          <span>as not installed</span>
        )}
      </span>
      {isModalOpen && (
        <PackagesActionSummaryDetails
          pkg={selectedPackage}
          instanceIds={instanceIds}
          close={closeModal}
          summaryVersion={version.name}
          action={action}
        />
      )}
    </div>
  );
};

export default PackagesActionSummaryItemVersion;
