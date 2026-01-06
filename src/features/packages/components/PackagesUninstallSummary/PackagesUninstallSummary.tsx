import { pluralizeWithCount } from "@/utils/_helpers";
import { Button } from "@canonical/react-components";
import { useState, type FC } from "react";
import { useBoolean } from "usehooks-ts";
import type { SelectedPackage } from "../../types";
import type { AvailableVersion } from "../../types/AvailableVersion";
import PackagesUninstallSummaryDetails from "../PackagesUninstallSummaryDetails";
import classes from "./PackagesUninstallSummary.module.scss";

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
  const [selectedSummary, setSelectedSummary] =
    useState<AvailableVersion | null>(null);

  const selectSummary = (version: AvailableVersion) => {
    setSelectedSummary(version);
    openModal();
  };

  return (
    <ul className="p-list u-no-margin--bottom">
      {selectedPackages.map((pkg) => (
        <li key={pkg.package.name} className={classes.package}>
          <strong className={classes.title}>{pkg.package.name}</strong>
          {pkg.selectedVersions.map((version) => {
            return (
              <>
                <div className={classes.row} key={version.name}>
                  <Button
                    type="button"
                    appearance="link"
                    className={classes.instances}
                    onClick={() => {
                      selectSummary(version);
                    }}
                  >
                    {pluralizeWithCount(version.num_computers, "instance")}
                  </Button>
                  <span>
                    Will uninstall{" "}
                    <code>
                      {pkg.package.name} {version.name}
                    </code>
                  </span>
                </div>
                <PackagesUninstallSummaryDetails
                  opened={isModalOpen}
                  pkg={pkg}
                  instanceIds={instanceIds}
                  close={closeModal}
                  selectedVersion={selectedSummary}
                />
              </>
            );
          })}
          <div className={classes.row}>
            <Button
              type="button"
              appearance="link"
              className={classes.instances}
            >
              {pluralizeWithCount(0, "instance")}
            </Button>
            <span>
              Will not uninstall{" "}
              <code>
                {pkg.package.name}
                {pkg.selectedVersions.length === 1 &&
                  ` ${pkg.selectedVersions[0].name}`}
              </code>
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default PackagesUninstallSummary;
