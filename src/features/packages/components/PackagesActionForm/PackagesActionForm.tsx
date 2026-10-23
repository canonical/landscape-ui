import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import useSidePanel from "@/hooks/useSidePanel";
import { type FC, useState } from "react";
import type {
  PackageChangePlanActionType,
  PackageWithVersions,
} from "../../types";
import PackageDropdownSearch from "../PackageDropdownSearch";
import PackagesActionSummary from "../PackagesActionSummary";
import {
  useCreatePackageChangePlan,
  useDeletePackageChangePlan,
} from "../../api";
import { getActionFormTitle } from "../../helpers";
import { getActionConfig } from "./helpers";
import useDebug from "@/hooks/useDebug";
import { toInstanceQuery } from "@/utils/_helpers";

interface PackagesActionFormProps {
  readonly instanceIds: number[];
  readonly actionType: Exclude<PackageChangePlanActionType, "upgrade">;
}

const PackagesActionForm: FC<PackagesActionFormProps> = ({
  instanceIds,
  actionType,
}) => {
  const debug = useDebug();

  const [selectedPackages, setSelectedPackages] = useState<
    PackageWithVersions[]
  >([]);
  const [packageChangePlanId, setPackageChangePlanId] = useState<number | null>(
    null,
  );

  const { setSidePanelTitle, setOnCloseOverride, closeSidePanel } =
    useSidePanel();

  const {
    mutateAsync: createPackageChangePlan,
    isPending: isCreatingPackageChangePlan,
  } = useCreatePackageChangePlan();
  const { mutateAsync: deletePackageChangePlan } = useDeletePackageChangePlan();

  const getValidationError = () => {
    if (!selectedPackages.length) {
      return "You must add at least one package to continue";
    }

    if (
      actionType == "change_version" &&
      selectedPackages.some(([, versions]) => !versions.length)
    ) {
      return "All selected packages must have at least one version";
    }

    return undefined;
  };

  switch (packageChangePlanId) {
    case null:
      return (
        <>
          <PackageDropdownSearch
            instanceIds={instanceIds}
            selectedItems={selectedPackages}
            setSelectedItems={setSelectedPackages}
            actionType={actionType}
          />
          <SidePanelFormButtons
            formError={getValidationError()}
            submitButtonText="Next"
            submitButtonAppearance="positive"
            submitButtonLoading={isCreatingPackageChangePlan}
            onSubmit={async () => {
              if (getValidationError()) return;

              try {
                const computer_query = toInstanceQuery(instanceIds);

                const config = getActionConfig(actionType, selectedPackages);

                const { data } = await createPackageChangePlan({
                  computer_query,
                  ...config,
                });

                setPackageChangePlanId(data.id);
                setSidePanelTitle("Summary");
                setOnCloseOverride(() => {
                  deletePackageChangePlan(data.id);
                  closeSidePanel();
                });
              } catch (error) {
                debug(error);
              }
            }}
          />
        </>
      );

    default:
      return (
        <PackagesActionSummary
          actionType={actionType}
          packageChangePlanId={packageChangePlanId}
          onBackButtonPress={() => {
            const title = getActionFormTitle(actionType);
            setPackageChangePlanId(null);
            setSidePanelTitle(title);
            setOnCloseOverride(undefined);
          }}
        />
      );
  }
};

export default PackagesActionForm;
