import { FC, useState } from "react";
import { useParams } from "react-router";
import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import { useActivities } from "@/features/activities";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import { usePackages } from "../../hooks";
import { InstancePackage } from "../../types";
import PackageDropdownSearch from "../PackageDropdownSearch";
import { UrlParams } from "@/types/UrlParams";

const PackagesInstallForm: FC = () => {
  const [selected, setSelected] = useState<InstancePackage[]>([]);

  const { instanceId: urlInstanceId, childInstanceId } = useParams<UrlParams>();
  const debug = useDebug();
  const { notify } = useNotify();
  const { packagesActionQuery } = usePackages();
  const { closeSidePanel } = useSidePanel();
  const { openActivityDetails } = useActivities();

  const instanceId = Number(childInstanceId ?? urlInstanceId);

  const {
    mutateAsync: installPackages,
    isPending: installPackagesQueryLoading,
  } = packagesActionQuery;

  const handleSubmit = async () => {
    try {
      const { data: activity } = await installPackages({
        action: "install",
        computer_ids: [instanceId],
        package_ids: selected.map(({ id }) => id),
      });

      closeSidePanel();

      notify.success({
        title: `You queued ${selected.length === 1 ? `package ${selected[0].name}` : `${selected.length} packages`} to be installed.`,
        message: `${selected.length === 1 ? `${selected[0].name} package` : `${selected.length} selected packages`} will be installed and are queued in Activities.`,
        actions: [
          { label: "Details", onClick: () => openActivityDetails(activity) },
        ],
      });
    } catch (error) {
      debug(error);
    }
  };
  return (
    <>
      <PackageDropdownSearch
        selectedItems={selected}
        setSelectedItems={(items) => setSelected(items)}
      />
      <SidePanelFormButtons
        submitButtonDisabled={
          installPackagesQueryLoading || selected.length === 0
        }
        submitButtonText="Install packages"
        submitButtonAppearance="positive"
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default PackagesInstallForm;
