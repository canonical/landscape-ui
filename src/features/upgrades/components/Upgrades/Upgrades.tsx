import { FC, Suspense, SyntheticEvent, useState } from "react";
import { Form, Tabs } from "@canonical/react-components";
import LoadingState from "@/components/layout/LoadingState";
import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import {
  UpgradeInstancePackagesParams,
  usePackages,
} from "@/features/packages";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import { Instance } from "@/types/Instance";
import UpgradeInfo from "../UpgradeInfo";
import { TAB_LINKS, TAB_PANELS } from "./constants";
import { getTabLinks } from "./helpers";

interface UpgradesProps {
  selectedInstances: Instance[];
}

const Upgrades: FC<UpgradesProps> = ({ selectedInstances }) => {
  const affectedInstances = selectedInstances.filter(
    ({ upgrades }) => upgrades?.security || upgrades?.regular,
  );

  const [activeTabLinkId, setActiveTabLinkId] = useState(TAB_LINKS[0].id);
  const [excludedPackages, setExcludedPackages] = useState<
    UpgradeInstancePackagesParams[]
  >(
    affectedInstances.map(({ id }) => ({
      id,
      exclude_packages: [],
    })),
  );

  const instancesWithUsn = affectedInstances.filter(
    ({ upgrades }) => upgrades?.security,
  );

  const debug = useDebug();
  const { notify } = useNotify();
  const { closeSidePanel } = useSidePanel();
  const { upgradeInstancesPackagesQuery } = usePackages();

  const {
    mutateAsync: upgradeInstancesPackages,
    isLoading: isUpgradingInstancesPackages,
  } = upgradeInstancesPackagesQuery;

  const handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();

    try {
      await upgradeInstancesPackages(excludedPackages);

      closeSidePanel();

      notify.success({
        title: `You queued ${affectedInstances.length} packages to be upgraded`,
        message: `${excludedPackages.length} packages on ${selectedInstances.length} instances will be upgraded and are queued in Activities`,
      });
    } catch (error) {
      debug(error);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <UpgradeInfo instances={selectedInstances} />

      <Tabs
        links={getTabLinks({
          activeTabLinkId,
          onTabLinkClick: (id) => setActiveTabLinkId(id),
          withUsnsTab: instancesWithUsn.length > 0,
        })}
      />

      <div tabIndex={0} role="tabpanel" aria-labelledby={activeTabLinkId}>
        <Suspense fallback={<LoadingState />}>
          {activeTabLinkId === "tab-link-instances" && (
            <TAB_PANELS.instances
              excludedPackages={excludedPackages}
              instances={affectedInstances}
              onExcludedPackagesChange={(newExcludedPackages) =>
                setExcludedPackages(newExcludedPackages)
              }
            />
          )}
          {activeTabLinkId === "tab-link-packages" && (
            <TAB_PANELS.packages
              excludedPackages={excludedPackages}
              instances={affectedInstances}
              onExcludedPackagesChange={(newExcludedPackages) =>
                setExcludedPackages(newExcludedPackages)
              }
            />
          )}
          {activeTabLinkId === "tab-link-usns" && (
            <TAB_PANELS.usns instances={instancesWithUsn} />
          )}
        </Suspense>
      </div>

      <SidePanelFormButtons
        submitButtonDisabled={isUpgradingInstancesPackages}
        submitButtonText="Upgrade"
      />
    </Form>
  );
};

export default Upgrades;
