import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import SidePanel from "@/components/layout/SidePanel";
import { RebootProfilesContainer } from "@/features/reboot-profiles";
import useSetDynamicFilterValidation from "@/hooks/useDynamicFilterValidation";
import usePageParams from "@/hooks/usePageParams";
import { Button } from "@canonical/react-components";
import type { FC } from "react";
import { lazy } from "react";

const RebootProfileAddSidePanel = lazy(async () =>
  import("@/features/reboot-profiles").then((module) => ({
    default: module.RebootProfileAddSidePanel,
  })),
);

const RebootProfileDetailsSidePanel = lazy(async () =>
  import("@/features/reboot-profiles").then((module) => ({
    default: module.RebootProfileDetailsSidePanel,
  })),
);

const RebootProfileDuplicateSidePanel = lazy(async () =>
  import("@/features/reboot-profiles").then((module) => ({
    default: module.RebootProfileDuplicateSidePanel,
  })),
);

const RebootProfileEditSidePanel = lazy(async () =>
  import("@/features/reboot-profiles").then((module) => ({
    default: module.RebootProfileEditSidePanel,
  })),
);

const RebootProfilesPage: FC = () => {
  const { action, setPageParams } = usePageParams();

  useSetDynamicFilterValidation("action", [
    "add",
    "duplicate",
    "edit",
    "view",
    "view/duplicate",
    "view/edit",
  ]);

  const handleAddProfile = () => {
    setPageParams({ action: "add", rebootProfile: -1 });
  };

  const closeSidePanel = () => {
    setPageParams({ action: "", rebootProfile: -1 });
  };

  return (
    <PageMain>
      <PageHeader
        title="Reboot profiles"
        actions={[
          <Button
            key="new-key-button"
            appearance="positive"
            onClick={handleAddProfile}
            type="button"
          >
            Add reboot profile
          </Button>,
        ]}
      />
      <PageContent>
        <RebootProfilesContainer />
      </PageContent>

      <SidePanel onClose={closeSidePanel} key="add" isOpen={!!action}>
        {action === "add" && (
          <SidePanel.Suspense key="add">
            <RebootProfileAddSidePanel />
          </SidePanel.Suspense>
        )}

        {(action === "duplicate" || action === "view/duplicate") && (
          <SidePanel.Suspense key="duplicate">
            <RebootProfileDuplicateSidePanel
              hasBackButton={action === "view/duplicate"}
            />
          </SidePanel.Suspense>
        )}

        {(action === "edit" || action === "view/edit") && (
          <SidePanel.Suspense key="edit">
            <RebootProfileEditSidePanel
              hasBackButton={action === "view/edit"}
            />
          </SidePanel.Suspense>
        )}

        {action === "view" && (
          <SidePanel.Suspense key="view">
            <RebootProfileDetailsSidePanel />
          </SidePanel.Suspense>
        )}
      </SidePanel>
    </PageMain>
  );
};

export default RebootProfilesPage;
