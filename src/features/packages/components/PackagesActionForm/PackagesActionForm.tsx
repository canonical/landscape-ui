import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import useSidePanel from "@/hooks/useSidePanel";
import { type FC, useState } from "react";
import type { Package, PackageAction } from "../../types";
import PackageDropdownSearch from "../PackageDropdownSearch";
import PackagesActionSummary from "../PackagesActionSummary";
import {
  useCreatePackageChangePlan,
  useDeletePackageChangePlan,
} from "../../api";
import { getActionFormTitle } from "../../helpers";
import { getActionConfig } from "./helpers";

interface PackagesActionFormProps {
  readonly instanceIds: number[];
  readonly action: PackageAction;
}

const PackagesActionForm: FC<PackagesActionFormProps> = ({
  instanceIds,
  action,
}) => {
  const [selectedPackages, setSelectedPackages] = useState<
    [Package, number[]][]
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
            selectedPackages={selectedPackages}
            setSelectedPackages={setSelectedPackages}
            action={action}
          />
          <SidePanelFormButtons
            submitButtonDisabled={!selectedPackages.length}
            submitButtonText="Next"
            submitButtonAppearance="positive"
            submitButtonLoading={isCreatingPackageChangePlan}
            onSubmit={async () => {
              const computer_query = instanceIds
                .map((id) => `id:${id}`)
                .join(" OR ");

              const packageIds = selectedPackages.map(([{ id }]) => id);
              const config = getActionConfig(action, packageIds);

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
            }}
          />
        </>
      );

    default:
      return (
        <PackagesActionSummary
          action={action}
          instanceIds={instanceIds}
          packageChangePlanId={packageChangePlanId}
          onBackButtonPress={() => {
            const title = getActionFormTitle(action);
            setPackageChangePlanId(null);
            setSidePanelTitle(title);
          }}
        />
      );
  }
};

export default PackagesActionForm;
