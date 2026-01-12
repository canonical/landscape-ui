import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import { useActivities } from "@/features/activities";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import {
  pluralize,
  pluralizeArray,
  pluralizeWithCount,
} from "@/utils/_helpers";
import type { FC } from "react";
import { useState } from "react";
import { usePackages } from "../../hooks";
import type { SelectedPackage, PackageActionFormType } from "../../types";
import PackageDropdownSearch from "../PackageDropdownSearch";
import PackagesActionSummary from "../PackagesActionSummary";

interface PackagesActionFormProps {
  readonly instanceIds: number[];
  readonly type: PackageActionFormType;
}

const PackagesActionForm: FC<PackagesActionFormProps> = ({
  instanceIds,
  type,
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

  const requestAction = type.action == "uninstall" ? "remove" : type.action;

  const handleSubmit = async () => {
    try {
      const { data: activity } = await changePackages({
        action: requestAction,
        computer_ids: instanceIds,
        package_ids: selectedPackages.map(({ id }) => id),
      });

      closeSidePanel();

      notify.success({
        title: `You queued ${pluralizeArray(selectedPackages, (selectedPackage) => `package ${selectedPackage.name}`, `${selectedPackages.length} packages`)} to be ${type.past}.`,
        message: `${pluralizeArray(selectedPackages, (selectedPackage) => `${selectedPackage.name} package`, `${selectedPackages.length} selected packages`)} will be ${type.past} and ${pluralize(selectedPackages.length, "is", "are")} queued in Activities.`,
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

  const actionButtonAppearance =
    type.action == "install" ? "positive" : "negative";

  switch (step) {
    case "form":
      return (
        <>
          <PackageDropdownSearch
            instanceIds={instanceIds}
            selectedPackages={selectedPackages}
            setSelectedPackages={setSelectedPackages}
            type={type}
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
            action={type.action}
            instanceIds={instanceIds}
            selectedPackages={selectedPackages}
          />
          <SidePanelFormButtons
            submitButtonLoading={changePackagesQueryLoading}
            submitButtonText={`${type.title} ${pluralizeWithCount(
              selectedPackages.length,
              "package",
            )}`}
            submitButtonAppearance={actionButtonAppearance}
            onSubmit={handleSubmit}
            hasBackButton
            onBackButtonPress={() => {
              setStep("form");
              setSidePanelTitle(`${type.title} packages`);
            }}
          />
        </>
      );
  }
};

export default PackagesActionForm;
