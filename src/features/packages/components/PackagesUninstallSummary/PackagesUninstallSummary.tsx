import { Button } from "@canonical/react-components";
import { useState, type FC } from "react";
import type { SelectedPackage } from "../../types";
import classes from "./PackagesUninstallSummary.module.scss";
import { useBoolean } from "usehooks-ts";
import PackagesUninstallSummaryDetails from "../PackagesUninstallSummaryDetails";
import { pluralizeWithCount } from "@/utils/_helpers";

interface PackagesUninstallSummaryProps {
  readonly selectedPackages: SelectedPackage[];
  readonly instanceIds: number[];
}

const PackagesUninstallSummary: FC<PackagesUninstallSummaryProps> = ({
  selectedPackages,
  instanceIds,
}) => {
  const {
    value: isModalOpen,
    setTrue: openModal,
    setFalse: closeModal,
  } = useBoolean();
  const [selectedSummary, setSelectedSummary] = useState("");

  const changingInstances = selectedPackages.flatMap((pkg) =>
    pkg.package.computers
      .filter((instance) => instance.status == "installed")
      .map((instance) => instance.id),
  );
  const unchangingInstances = instanceIds.filter(
    (id) => !changingInstances.includes(id),
  );

  const selectSummary = (version: string) => {
    setSelectedSummary(version);
    openModal();
  };

  return (
    <ul className="p-list u-no-margin--bottom">
      {selectedPackages.map((pkg) => (
        <li key={pkg.package.name} className={classes.package}>
          <strong className={classes.title}>{pkg.package.name}</strong>
          {pkg.selectedVersions.map((version) => (
            <>
              <div className={classes.row} key={version}>
                <Button
                  type="button"
                  appearance="link"
                  className={classes.instances}
                  onClick={() => {
                    selectSummary(version);
                  }}
                >
                  {pluralizeWithCount(changingInstances.length, "instance")}
                </Button>
                <span>
                  Will uninstall{" "}
                  <code>
                    {pkg.package.name} {version}
                  </code>
                </span>
              </div>
              {unchangingInstances.length > 0 && (
                <div className={classes.row}>
                  <Button
                    type="button"
                    appearance="link"
                    className={classes.instances}
                    onClick={() => {
                      selectSummary(version);
                    }}
                  >
                    {pluralizeWithCount(changingInstances.length, "instance")}
                  </Button>
                  <span>
                    Don&apos;t have{" "}
                    <code>
                      {pkg.package.name} {version}
                    </code>{" "}
                    installed
                  </span>
                </div>
              )}
              <PackagesUninstallSummaryDetails
                opened={isModalOpen}
                pkg={pkg}
                instanceIds={instanceIds}
                close={closeModal}
                selectedVersion={selectedSummary}
              />
            </>
          ))}
        </li>
      ))}
    </ul>
  );
};

export default PackagesUninstallSummary;
