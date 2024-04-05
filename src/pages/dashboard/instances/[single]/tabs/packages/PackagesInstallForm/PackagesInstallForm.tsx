import { FC, useState } from "react";
import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import useDebug from "@/hooks/useDebug";
import { usePackages } from "@/hooks/usePackages";
import useSidePanel from "@/hooks/useSidePanel";
import { Package } from "@/types/Package";
import useNotify from "@/hooks/useNotify";
import PackageDropdownSearch from "../PackageDropdownSearch";

interface PackagesInstallFormProps {
  instanceId: number;
}

const PackagesInstallForm: FC<PackagesInstallFormProps> = ({ instanceId }) => {
  const [selected, setSelected] = useState<Package[]>([]);

  const debug = useDebug();
  const { notify } = useNotify();
  const { installPackagesQuery } = usePackages();
  const { closeSidePanel } = useSidePanel();

  const {
    mutateAsync: installPackages,
    isLoading: installPackagesQueryLoading,
  } = installPackagesQuery;

  const handleSubmit = async () => {
    try {
      await installPackages({
        packages: selected.map(({ name }) => name),
        query: `id:${instanceId}`,
      });
      closeSidePanel();
      notify.success({
        message: `You queued ${selected.length === 1 ? `package ${selected[0].name}` : `${selected.length} packages`} to be installed.`,
      });
    } catch (error) {
      debug(error);
    }
  };
  return (
    <>
      <PackageDropdownSearch
        instanceId={instanceId}
        selectedItems={selected}
        setSelectedItems={(items) => setSelected(items)}
      />
      <SidePanelFormButtons
        disabled={installPackagesQueryLoading || selected.length === 0}
        submitButtonText="Install packages"
        bottomSticky
        removeButtonMargin
        submitButtonAppearance="positive"
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default PackagesInstallForm;
