import { FC, SyntheticEvent } from "react";
import { Instance } from "@/types/Instance";
import useDebug from "@/hooks/useDebug";
import { usePackages } from "@/hooks/usePackages";
import { Form } from "@canonical/react-components";
import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import UpgradesUsnContainer from "@/pages/dashboard/instances/UpgradesUsnContainer";
import UpgradesInstanceList from "@/pages/dashboard/instances/UpgradesInstanceList";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";

interface UpgradesProps {
  selectedInstances: Instance[];
}

const Upgrades: FC<UpgradesProps> = ({ selectedInstances }) => {
  const debug = useDebug();
  const { notify } = useNotify();
  const { closeSidePanel } = useSidePanel();
  const { getPackagesQuery, upgradePackagesQuery } = usePackages();

  const { data: getPackagesQueryResult, error: getPackagesQueryError } =
    getPackagesQuery({
      query: `id:${selectedInstances.map(({ id }) => id).join(" OR id:")}`,
      upgrade: true,
    });

  if (getPackagesQueryError) {
    debug(getPackagesQueryError);
  }

  const { mutateAsync: upgradePackages, isLoading: upgradePackagesLoading } =
    upgradePackagesQuery;

  const handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();

    try {
      await upgradePackages({
        query: `id:${selectedInstances.map(({ id }) => id).join(" OR id:")}`,
        packages: (getPackagesQueryResult?.data.results ?? []).map(
          ({ name }) => name,
        ),
      });

      closeSidePanel();

      notify.success({
        title: `You queued ${getPackagesQueryResult?.data.count} packages to be upgraded`,
        message: `${getPackagesQueryResult?.data.count} packages on ${selectedInstances.length} instances will be upgraded and are queued in Activities`,
      });
    } catch (error) {
      debug(error);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <UpgradesUsnContainer
        instanceIds={selectedInstances.map(({ id }) => id)}
      />

      <UpgradesInstanceList instances={selectedInstances} />

      <SidePanelFormButtons
        submitButtonDisabled={upgradePackagesLoading}
        submitButtonText="Request all upgrades"
      />
    </Form>
  );
};

export default Upgrades;
