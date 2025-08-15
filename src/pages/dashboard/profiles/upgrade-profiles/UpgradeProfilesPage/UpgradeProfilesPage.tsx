import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import SidePanel from "@/components/layout/SidePanel";
import useSetDynamicFilterValidation from "@/hooks/useDynamicFilterValidation";
import usePageParams from "@/hooks/usePageParams";
import UpgradeProfilesContainer from "@/pages/dashboard/profiles/upgrade-profiles/UpgradeProfilesContainer";
import { Button } from "@canonical/react-components";
import type { FC } from "react";
import { lazy } from "react";

const UpgradeProfileAddSidePanel = lazy(() =>
  import("@/features/upgrade-profiles").then((module) => ({
    default: module.UpgradeProfileAddSidePanel,
  })),
);

const UpgradeProfileDetailsSidePanel = lazy(() =>
  import("@/features/upgrade-profiles").then((module) => ({
    default: module.UpgradeProfileDetailsSidePanel,
  })),
);

const UpgradeProfileEditSidePanel = lazy(() =>
  import("@/features/upgrade-profiles").then((module) => ({
    default: module.UpgradeProfileEditSidePanel,
  })),
);

const UpgradeProfilesPage: FC = () => {
  const { action, setPageParams } = usePageParams();

  useSetDynamicFilterValidation("action", ["add", "edit", "view", "view/edit"]);

  const handleAddUpgradeProfile = () => {
    setPageParams({ action: "add", upgradeProfile: -1 });
  };

  const closeSidePanel = () => {
    setPageParams({ action: "", upgradeProfile: -1 });
  };

  return (
    <PageMain>
      <PageHeader
        title="Upgrade profiles"
        actions={[
          <Button
            key="add"
            type="button"
            appearance="positive"
            onClick={handleAddUpgradeProfile}
          >
            Add upgrade profile
          </Button>,
        ]}
      />
      <PageContent>
        <UpgradeProfilesContainer />
      </PageContent>

      <SidePanel onClose={closeSidePanel} isOpen={!!action}>
        {action === "add" && (
          <SidePanel.Suspense key="add">
            <UpgradeProfileAddSidePanel />
          </SidePanel.Suspense>
        )}

        {(action === "edit" || action === "view/edit") && (
          <SidePanel.Suspense key="edit">
            <UpgradeProfileEditSidePanel
              hasBackButton={action === "view/edit"}
            />
          </SidePanel.Suspense>
        )}

        {action === "view" && (
          <SidePanel.Suspense key="view">
            <UpgradeProfileDetailsSidePanel />
          </SidePanel.Suspense>
        )}
      </SidePanel>
    </PageMain>
  );
};

export default UpgradeProfilesPage;
