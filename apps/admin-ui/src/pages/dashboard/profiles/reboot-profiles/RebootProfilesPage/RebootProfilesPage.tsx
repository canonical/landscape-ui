import LoadingState from "@/components/layout/LoadingState";
import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import { RebootProfilesContainer } from "@/features/reboot-profiles";
import useSidePanel from "@/hooks/useSidePanel";
import { Button } from "@canonical/react-components";
import type { FC } from "react";
import { lazy, Suspense } from "react";

const RebootProfilesForm = lazy(async () =>
  import("@/features/reboot-profiles").then((module) => ({
    default: module.RebootProfilesForm,
  })),
);

const RebootProfilesPage: FC = () => {
  const { setSidePanelContent } = useSidePanel();

  const handleAddProfile = () => {
    setSidePanelContent(
      "Add reboot profile",
      <Suspense fallback={<LoadingState />}>
        <RebootProfilesForm action="add" />,
      </Suspense>,
    );
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
    </PageMain>
  );
};

export default RebootProfilesPage;
