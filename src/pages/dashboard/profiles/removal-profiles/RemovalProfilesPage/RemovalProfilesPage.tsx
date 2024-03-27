import { FC, lazy, Suspense } from "react";
import { Button } from "@canonical/react-components";
import LoadingState from "@/components/layout/LoadingState";
import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import useSidePanel from "@/hooks/useSidePanel";
import RemovalProfileContainer from "@/pages/dashboard/profiles/removal-profiles/RemovalProfileContainer";

const SingleRemovalProfileForm = lazy(() =>
  import("@/features/removal-profiles").then((module) => ({
    default: module.SingleRemovalProfileForm,
  })),
);

const RemovalProfilesPage: FC = () => {
  const { setSidePanelContent } = useSidePanel();

  const handleCreate = () => {
    setSidePanelContent(
      "Add removal profile",
      <Suspense fallback={<LoadingState />}>
        <SingleRemovalProfileForm action="add" />
      </Suspense>,
    );
  };

  return (
    <PageMain>
      <PageHeader
        title="Removal profiles"
        actions={[
          <Button
            key="create"
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
    </PageMain>
  );
};

export default RemovalProfilesPage;
