import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import useSidePanel from "@/hooks/useSidePanel";
import { type FC, useState } from "react";
import type { Package, PackageAction } from "../../types";
import PackageDropdownSearch from "../PackageDropdownSearch";
import PackagesActionSummary from "../PackagesActionSummary";

import type { CreatePackageChangePlanRequest } from "../../api";
import {
  useCreatePackageChangePlan,
  useDeletePackageChangePlan,
} from "../../api";
import { capitalize } from "@/utils/_helpers";

interface PackagesActionFormProps {
  readonly instanceIds: number[];
  readonly action: PackageAction;
}

const PackagesActionForm: FC<PackagesActionFormProps> = ({
  instanceIds,
  action,
}) => {
  const [selectedPackages, setSelectedPackages] = useState<Package[]>([]);
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

  const getCreatePackageChangePlanRequest =
    (): CreatePackageChangePlanRequest => {
      const computer_query = instanceIds.map((id) => `id:${id}`).join(" OR ");
      const package_ids = selectedPackages.map(({ id }) => id);

      switch (action) {
        case "install":
          return {
            computer_query,
            install_config: {
              by_ids: {
                package_ids,
              },
            },
          };

        case "uninstall":
          return {
            computer_query,
            remove_config: {
              by_ids: {
                package_ids,
              },
            },
          };

        case "hold":
          return {
            computer_query,
            hold_config: {
              package_ids,
            },
          };

        case "unhold":
          return {
            computer_query,
            unhold_config: {
              package_ids,
            },
          };

        case "downgrade":
          return {
            computer_query,
            change_version_config: { version_changes: [] },
          };
      }
    };

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
              const request = getCreatePackageChangePlanRequest();
              const { data } = await createPackageChangePlan(request);
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
          selectedPackages={selectedPackages}
          packageChangePlanId={packageChangePlanId}
          onBackButtonPress={() => {
            setPackageChangePlanId(null);
            setSidePanelTitle(`${capitalize(action)} packages`);
          }}
        />
      );
  }
};

export default PackagesActionForm;
