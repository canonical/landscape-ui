import { Notification } from "@canonical/react-components";
import type { FC } from "react";
import { useState } from "react";
import { useParams } from "react-router";
import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import { useOpenActivityDetailsPanel } from "@/features/activities";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import { usePackages } from "../../hooks";
import type { InstancePackage } from "../../types";
import PackageDropdownSearch from "../PackageDropdownSearch";
import type { UrlParams } from "@/types/UrlParams";
import { pluralize, getSelectionLabel } from "@/utils/_helpers";

const PackagesInstallForm: FC = () => {
  const [selected, setSelected] = useState<InstancePackage[]>([]);
  const [showNoPackagesError, setShowNoPackagesError] = useState(false);

  const { instanceId: urlInstanceId, childInstanceId } = useParams<UrlParams>();
  const debug = useDebug();
  const { notify } = useNotify();
  const { packagesActionQuery } = usePackages();
  const { closeSidePanel } = useSidePanel();
  const openActivityDetails = useOpenActivityDetailsPanel();

  const instanceId = Number(childInstanceId ?? urlInstanceId);

  const {
    mutateAsync: installPackages,
    isPending: installPackagesQueryLoading,
  } = packagesActionQuery;

  const handleSubmit = async () => {
    if (selected.length === 0) {
      setShowNoPackagesError(true);
      return;
    }
    setShowNoPackagesError(false);

    try {
      const { data: activity } = await installPackages({
        action: "install",
        computer_ids: [instanceId],
        package_ids: selected.map(({ id }) => id),
      });

      closeSidePanel();

      notify.success({
        title: `You queued ${getSelectionLabel(
          selected,
          (pkg) => `package ${pkg.name}`,
          `packages`,
        )} to be installed.`,
        message: `${getSelectionLabel(
          selected,
          (pkg) => `${pkg.name} package`,
          `selected packages`,
        )} will be installed and ${pluralize(selected.length, [
          "is",
          "are",
        ])} queued in Activities.`,
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

  return (
    <>
      {showNoPackagesError && (
        <Notification severity="caution" title="No packages selected">
          Select at least one package to install.
        </Notification>
      )}
      <PackageDropdownSearch
        selectedItems={selected}
        setSelectedItems={(items) => {
          setSelected(items);
          setShowNoPackagesError(false);
        }}
      />
      <SidePanelFormButtons
        submitButtonLoading={installPackagesQueryLoading}
        submitButtonText="Install packages"
        submitButtonAppearance="positive"
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default PackagesInstallForm;
