import { pluralizeWithCount } from "@/utils/_helpers";
import { Button } from "@canonical/react-components";
import { useState, type FC } from "react";
import { useBoolean } from "usehooks-ts";
import PackagesUninstallSummaryDetails from "../PackagesUninstallSummaryDetails";
import classes from "./PackagesUninstallSummary.module.scss";
import { useGetDryRunInstances } from "../../api";
import LoadingState from "@/components/layout/LoadingState";
import type {
  PackageVersionsInstanceCount,
  SelectedPackage,
} from "../../types";

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
  const [selectedPackage, setSelectedPackage] =
    useState<SelectedPackage | null>(null);

  const { isPending, data, error } = useGetDryRunInstances({
    action: "uninstall",
    packages: selectedPackages,
    query: `id:${instanceIds}`,
  });

  if (error) {
    throw error;
  }

  const versionsInstances = data?.data ?? [];

  const getSummaryPackage = (pkg: PackageVersionsInstanceCount) => {
    const summaryPackage = {
      name: pkg.name,
      id: pkg.id,
      versions: pkg.versions.map(({ name }) => name),
    };
    return summaryPackage;
  };

  const selectSummary = (
    pkg: PackageVersionsInstanceCount,
    summary: string,
  ) => {
    setSelectedPackage(getSummaryPackage(pkg));
    setSelectedSummary(summary);
    openModal();
  };

  return isPending ? (
    <LoadingState />
  ) : (
    <ul className="p-list u-no-margin--bottom">
      {versionsInstances.map((pkg) => (
        <li key={pkg.name} className={classes.package}>
          <strong className={classes.title}>{pkg.name}</strong>
          {pkg.versions.map((version) => {
            return (
              <div className={classes.row} key={version.name}>
                <Button
                  type="button"
                  appearance="link"
                  className={classes.instances}
                  onClick={() => {
                    selectSummary(pkg, version.name);
                  }}
                >
                  {pluralizeWithCount(version.num_computers ?? 0, "instance")}
                </Button>
                <span>
                  Will uninstall{" "}
                  <code>
                    {pkg.name} {version.name}
                  </code>
                </span>
              </div>
            );
          })}
          <div className={classes.row}>
            <Button
              type="button"
              appearance="link"
              className={classes.instances}
              onClick={() => {
                setSelectedPackage(getSummaryPackage(pkg));
                selectSummary(pkg, "");
              }}
            >
              {pluralizeWithCount(0, "instance")}
            </Button>
            <span>
              Will not uninstall{" "}
              <code>
                {pkg.name}
                {pkg.versions.length === 1 && ` ${pkg.versions[0].name}`}
              </code>
            </span>
          </div>
        </li>
      ))}
      {selectedPackage && (
        <PackagesUninstallSummaryDetails
          opened={isModalOpen}
          pkg={selectedPackage}
          instanceIds={instanceIds}
          close={closeModal}
          summaryVersion={selectedSummary}
        />
      )}
    </ul>
  );
};

export default PackagesUninstallSummary;
