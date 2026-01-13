import LoadingState from "@/components/layout/LoadingState";
import { hasOneItem, pluralizeWithCount } from "@/utils/_helpers";
import { Button } from "@canonical/react-components";
import type { FC } from "react";
import { useBoolean } from "usehooks-ts";
import { useGetDryRunInstances } from "../../../../api";
import type { PackageAction, SelectedPackage } from "../../../../types";
import PackagesUninstallSummaryDetails from "../PackagesActionSummaryDetails";
import PackagesActionSummaryItemVersion from "../PackagesActionSummaryItemVersion";
import classes from "./PackagesActionSummaryItem.module.scss";

interface PackagesActionSummaryItemProps {
  readonly action: PackageAction;
  readonly selectedPackage: SelectedPackage;
  readonly instanceIds: number[];
}

const PackagesActionSummaryItem: FC<PackagesActionSummaryItemProps> = ({
  action,
  instanceIds,
  selectedPackage,
}) => {
  const {
    value: isModalOpen,
    setTrue: openModal,
    setFalse: closeModal,
  } = useBoolean();

  const {
    isPending,
    data: packageVersionsResult,
    error,
  } = useGetDryRunInstances({
    action,
    id: selectedPackage.id,
    versions: selectedPackage.versions,
    query: instanceIds.map((instanceId) => `id:${instanceId}`).join(" OR "),
  });

  if (error) {
    throw error;
  }

  if (isPending) {
    return <LoadingState />;
  }

  return (
    <li key={selectedPackage.name} className={classes.package}>
      <strong className={classes.title}>{selectedPackage.name}</strong>
      {packageVersionsResult.data.map((version) => {
        return (
          <PackagesActionSummaryItemVersion
            key={version.name}
            action={action}
            instanceIds={instanceIds}
            selectedPackage={selectedPackage}
            version={version}
          />
        );
      })}
      <div className={classes.row}>
        <Button
          type="button"
          appearance="link"
          className={classes.instances}
          onClick={openModal}
        >
          {pluralizeWithCount(
            packageVersionsResult.data.reduce((instanceCount, version) => {
              return instanceCount - version.num_computers;
            }, instanceIds.length),
            "instance",
          )}
        </Button>
        <span>
          Will not {action}{" "}
          <code>
            {selectedPackage.name}
            {hasOneItem(packageVersionsResult.data) &&
              ` ${packageVersionsResult.data[0].name}`}
          </code>
        </span>
      </div>
      {isModalOpen && (
        <PackagesUninstallSummaryDetails
          pkg={selectedPackage}
          instanceIds={instanceIds}
          close={closeModal}
          action={action}
        />
      )}
    </li>
  );
};

export default PackagesActionSummaryItem;
