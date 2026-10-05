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
            submitButtonDisabled={
              !selectedPackages.length ||
              (actionType == "change_version" &&
                selectedPackages.some(([, versions]) => !versions.length))
            }
            submitButtonText="Next"
            submitButtonAppearance="positive"
            submitButtonLoading={isCreatingPackageChangePlan}
            onSubmit={async () => {
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
          instanceIds={instanceIds}
          packageChangePlanId={packageChangePlanId}
          onBackButtonPress={() => {
            const title = getActionFormTitle(actionType);
            setPackageChangePlanId(null);
            setSidePanelTitle(title);
          }}
        />
      );
  }
};

export default PackagesActionForm;
