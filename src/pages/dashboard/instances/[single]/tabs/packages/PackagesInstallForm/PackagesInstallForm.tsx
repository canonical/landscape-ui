import { FC, useState } from "react";
import DropdownSearch from "@/components/form/DropdownSearch/DropdownSearch";
import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import useDebug from "@/hooks/useDebug";
import { usePackages } from "@/hooks/usePackages";
import useSidePanel from "@/hooks/useSidePanel";
import { Package } from "@/types/Package";
import useNotify from "@/hooks/useNotify";

interface PackagesInstallFormProps {
  instanceId: number;
}

const PackagesInstallForm: FC<PackagesInstallFormProps> = ({ instanceId }) => {
  const [selected, setSelected] = useState<Package[]>([]);

  const debug = useDebug();
  const { notify } = useNotify();
  const { getInstancePackagesQuery, installPackagesQuery } = usePackages();
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
      <DropdownSearch
        itemType="package"
        selectedItems={selected}
        setSelectedItems={(items) => setSelected(items)}
        getDropdownInfo={(search: string) =>
          getInstancePackagesQuery(
            {
              instance_id: instanceId,
              available: true,
              installed: false,
              upgrade: false,
              held: false,
              limit: 50,
              search: search,
            },
            {
              enabled: search.length > 2,
            },
          )
        }
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
