import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import { useActivities } from "@/features/activities";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import { pluralize, pluralizeWithCount } from "@/utils/_helpers";
import type { FC } from "react";
import { useState } from "react";
import { usePackages } from "../../hooks";
import type { SelectedPackage } from "../../types";
import PackageDropdownSearch from "../PackageDropdownSearch";
import PackagesUninstallSummary from "../PackagesUninstallSummary";

interface PackagesUninstallFormProps {
  readonly instanceIds: number[];
}

const PackagesUninstallForm: FC<PackagesUninstallFormProps> = ({
  instanceIds,
}) => {
  const [selectedPackages, setSelectedPackages] = useState<SelectedPackage[]>(
    [],
  );
  const [step, setStep] = useState<"uninstall" | "summary">("uninstall");

  const debug = useDebug();
  const { notify } = useNotify();
  const { packagesActionQuery } = usePackages();
  const { closeSidePanel } = useSidePanel();
  const { openActivityDetails } = useActivities();
  const { setSidePanelTitle } = useSidePanel();

  const {
    mutateAsync: uninstallPackages,
    isPending: uninstallPackagesQueryLoading,
  } = packagesActionQuery;

  const disableButton = selectedPackages.some(
    ({ selectedVersions }) => selectedVersions.length == 0,
  );

  const handleSubmit = async () => {
    try {
      const { data: activity } = await uninstallPackages({
        action: "remove",
        computer_ids: instanceIds,
        package_ids: selectedPackages.map(({ package: { id } }) => id),
      });

      closeSidePanel();

      notify.success({
        title: `You queued ${pluralize(selectedPackages.length, `package ${selectedPackages[0].package.name}`, `${selectedPackages.length} packages`)} to be uninstalled.`,
        message: `${pluralize(selectedPackages.length, `${selectedPackages[0].package.name} package`, `${selectedPackages.length} selected packages`)} will be uninstalled and ${pluralize(selectedPackages.length, "is", "are")} queued in Activities.`,
        actions: [
          {
            label: "Details",
            onClick: () => {
              openActivityDetails(activity);
            },
          },
        ],
      });
    } catch (error) {
      debug(error);
    }
  };

  switch (step) {
    case "uninstall":
      return (
        <>
          <PackageDropdownSearch
            instanceIds={instanceIds}
            selectedPackages={selectedPackages}
            setSelectedPackages={(items) => {
              setSelectedPackages(items);
            }}
            installed
          />
          <SidePanelFormButtons
            submitButtonDisabled={disableButton}
            submitButtonText="Next"
            submitButtonAppearance="positive"
            onSubmit={() => {
              setStep("summary");
              setSidePanelTitle("Summary");
            }}
          />
        </>
      );

    case "summary":
      return (
        <>
          <PackagesUninstallSummary
            selectedPackages={selectedPackages}
            instanceIds={instanceIds}
          />
          <SidePanelFormButtons
            submitButtonLoading={uninstallPackagesQueryLoading}
            submitButtonText={`Uninstall ${pluralizeWithCount(
              selectedPackages.length,
              "package",
            )}`}
            submitButtonAppearance="negative"
            onSubmit={handleSubmit}
            hasBackButton
            onBackButtonPress={() => {
              setStep("uninstall");
              setSidePanelTitle("Uninstall packages");
            }}
          />
        </>
      );
  }
};

export default PackagesUninstallForm;
