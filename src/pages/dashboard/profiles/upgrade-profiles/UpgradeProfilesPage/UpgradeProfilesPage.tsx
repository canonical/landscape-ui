import type { FC } from "react";
import { lazy, Suspense } from "react";
import PageMain from "@/components/layout/PageMain";
import PageHeader from "@/components/layout/PageHeader";
import PageContent from "@/components/layout/PageContent";
import useSidePanel from "@/hooks/useSidePanel";
import { Button } from "@canonical/react-components";
import LoadingState from "@/components/layout/LoadingState";
import UpgradeProfilesContainer from "@/pages/dashboard/profiles/upgrade-profiles/UpgradeProfilesContainer";

const SingleUpgradeProfileForm = lazy(() =>
  import("@/features/upgrade-profiles").then((module) => ({
    default: module.SingleUpgradeProfileForm,
  })),
);

const UpgradeProfilesPage: FC = () => {
  const { setSidePanelContent } = useSidePanel();

  const handleAddUpgradeProfile = () => {
    setSidePanelContent(
      "Add upgrade profile",
      <Suspense fallback={<LoadingState />}>
        <SingleUpgradeProfileForm action="add" />
      </Suspense>,
    );
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
    </PageMain>
  );
};

export default UpgradeProfilesPage;
