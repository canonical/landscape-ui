import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import SidePanel from "@/components/layout/SidePanel";
import useSetDynamicFilterValidation from "@/hooks/useDynamicFilterValidation";
import usePageParams from "@/hooks/usePageParams";
import RemovalProfileContainer from "@/pages/dashboard/profiles/removal-profiles/RemovalProfileContainer";
import { Button } from "@canonical/react-components";
import { lazy, type FC } from "react";

const RemovalProfileAddSidePanel = lazy(async () =>
  import("@/features/removal-profiles").then((module) => ({
    default: module.RemovalProfileAddSidePanel,
  })),
);

const RemovalProfileDetailsSidePanel = lazy(async () =>
  import("@/features/removal-profiles").then((module) => ({
    default: module.RemovalProfileDetailsSidePanel,
  })),
);

const RemovalProfileEditSidePanel = lazy(async () =>
  import("@/features/removal-profiles").then((module) => ({
    default: module.RemovalProfileEditSidePanel,
  })),
);

const RemovalProfilesPage: FC = () => {
  const { action, setPageParams } = usePageParams();

  useSetDynamicFilterValidation("action", ["add", "edit", "view", "view/edit"]);

  const handleCreate = () => {
    setPageParams({ action: "add", removalProfile: -1 });
  };

  const close = () => {
    setPageParams({ action: "", rebootProfile: -1 });
  };

  return (
    <PageMain>
      <PageHeader
        title="Removal profiles"
        actions={[
          <Button
            key="add"
            type="button"
            appearance="positive"
            onClick={handleCreate}
          >
            Add removal profile
          </Button>,
        ]}
      />
      <PageContent>
        <RemovalProfileContainer />
      </PageContent>

      <SidePanel isOpen={!!action} onClose={close}>
        {action === "add" && (
          <SidePanel.Suspense key="add">
            <RemovalProfileAddSidePanel />
          </SidePanel.Suspense>
        )}

        {(action === "edit" || action === "view/edit") && (
          <SidePanel.Suspense key="edit">
            <RemovalProfileEditSidePanel
              hasBackButton={action === "view/edit"}
            />
          </SidePanel.Suspense>
        )}

        {action === "view" && (
          <SidePanel.Suspense key="view">
            <RemovalProfileDetailsSidePanel />
          </SidePanel.Suspense>
        )}
      </SidePanel>
    </PageMain>
  );
};

export default RemovalProfilesPage;
