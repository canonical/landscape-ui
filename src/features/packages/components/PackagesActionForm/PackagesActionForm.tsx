import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import { useActivities } from "@/features/activities";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import {
  capitalize,
  pluralize,
  pluralizeArray,
  pluralizeWithCount,
} from "@/utils/_helpers";
import type { FC } from "react";
import { useState } from "react";
import { usePackages } from "../../hooks";
import type { PackageAction, SelectedPackage } from "../../types";
import PackageDropdownSearch from "../PackageDropdownSearch";
import PackagesActionSummary from "../PackagesActionSummary";
import { mapActionToPast } from "../../helpers";

interface PackagesActionFormProps {
  readonly instanceIds: number[];
  readonly action: PackageAction;
}

const PackagesActionForm: FC<PackagesActionFormProps> = ({
  instanceIds,
  action,
}) => {
  const [selectedPackages, setSelectedPackages] = useState<SelectedPackage[]>(
    [],
  );
  const [step, setStep] = useState<"form" | "summary">("form");

  const debug = useDebug();
  const { notify } = useNotify();
  const { packagesActionQuery } = usePackages();
  const { closeSidePanel } = useSidePanel();
  const { openActivityDetails } = useActivities();
  const { setSidePanelTitle } = useSidePanel();

  const { mutateAsync: changePackages, isPending: changePackagesQueryLoading } =
    packagesActionQuery;

  const requestAction = action == "uninstall" ? "remove" : action;
  const actionPast = mapActionToPast(action);

  const handleSubmit = async () => {
    try {
      const { data: activity } = await changePackages({
        action: requestAction,
        computer_ids: instanceIds,
        package_ids: selectedPackages.map(({ id }) => id),
      });

      closeSidePanel();

      notify.success({
        title: `You queued ${pluralizeArray(selectedPackages, (selectedPackage) => `package ${selectedPackage.name}`, `${selectedPackages.length} packages`)} to be ${actionPast}.`,
        message: `${pluralizeArray(selectedPackages, (selectedPackage) => `${selectedPackage.name} package`, `${selectedPackages.length} selected packages`)} will be ${actionPast} and ${pluralize(selectedPackages.length, "is", "are")} queued in Activities.`,
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

  const title = capitalize(action);
  const actionButtonAppearance = action == "install" ? "positive" : "negative";

  switch (step) {
    case "form":
      return (
        <>
          <PackageDropdownSearch
            instanceIds={instanceIds}
            selectedPackages={selectedPackages}
            setSelectedPackages={setSelectedPackages}
            action={action}
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
            action={action}
            instanceIds={instanceIds}
            selectedPackages={selectedPackages}
          />
          <SidePanelFormButtons
            submitButtonLoading={changePackagesQueryLoading}
            submitButtonText={`${title} ${pluralizeWithCount(
              selectedPackages.length,
              "package",
            )}`}
            submitButtonAppearance={actionButtonAppearance}
            onSubmit={handleSubmit}
            hasBackButton
            onBackButtonPress={() => {
              setStep("form");
              setSidePanelTitle(`${title} packages`);
            }}
          />
        </>
      );
  }
};

export default PackagesActionForm;
