import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import { useActivities } from "@/features/activities";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import { pluralize, pluralizeWithCount } from "@/utils/_helpers";
import type { FC } from "react";
import { useState } from "react";
import { usePackages } from "../../hooks";
import type { SelectedPackage } from "../../types/SelectedPackage";
import PackageDropdownSearch from "../PackageDropdownSearch";
import PackagesActionSummary from "../PackagesActionSummary";

interface PackagesInstallFormProps {
  readonly instanceIds: number[];
}

const PackagesInstallForm: FC<PackagesInstallFormProps> = ({ instanceIds }) => {
  const [selectedPackages, setSelectedPackages] = useState<SelectedPackage[]>(
    [],
  );
  const [step, setStep] = useState<"install" | "summary">("install");

  const debug = useDebug();
  const { notify } = useNotify();
  const { packagesActionQuery } = usePackages();
  const { closeSidePanel } = useSidePanel();
  const { openActivityDetails } = useActivities();
  const { setSidePanelTitle } = useSidePanel();

  const {
    mutateAsync: installPackages,
    isPending: installPackagesQueryLoading,
  } = packagesActionQuery;

  const handleSubmit = async () => {
    try {
      const { data: activity } = await installPackages({
        action: "install",
        computer_ids: instanceIds,
        package_ids: selectedPackages.map(({ id }) => id),
      });

      closeSidePanel();

      notify.success({
        title: `You queued ${pluralize(selectedPackages.length, `package ${selectedPackages[0].name}`, `${selectedPackages.length} packages`)} to be installed.`,
        message: `${pluralize(selectedPackages.length, `${selectedPackages[0].name} package`, `${selectedPackages.length} selected packages`)} will be installed and ${pluralize(selectedPackages.length, "is", "are")} queued in Activities.`,
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
    case "install":
      return (
        <>
          <PackageDropdownSearch
            instanceIds={instanceIds}
            selectedPackages={selectedPackages}
            setSelectedPackages={setSelectedPackages}
            available={true}
            installed={false}
            held={false}
            upgrade={false}
          />
          <SidePanelFormButtons
            submitButtonDisabled={
              !selectedPackages.length ||
              selectedPackages.some(({ versions }) => !versions.length)
            }
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
          <PackagesActionSummary
            action="install"
            instanceIds={instanceIds}
            selectedPackages={selectedPackages}
          />
          <SidePanelFormButtons
            submitButtonLoading={installPackagesQueryLoading}
            submitButtonText={`Install ${pluralizeWithCount(
              selectedPackages.length,
              "package",
            )}`}
            submitButtonAppearance="positive"
            onSubmit={handleSubmit}
            hasBackButton
            onBackButtonPress={() => {
              setStep("install");
              setSidePanelTitle("Install packages");
            }}
          />
        </>
      );
  }
};

export default PackagesInstallForm;
