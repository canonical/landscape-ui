import type { FC } from "react";
import { Button } from "@canonical/react-components";
import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import { SingleRemovalProfileForm } from "@/features/removal-profiles";
import useSidePanel from "@/hooks/useSidePanel";
import RemovalProfileContainer from "@/pages/dashboard/profiles/removal-profiles/RemovalProfileContainer";

const RemovalProfilesPage: FC = () => {
  const { setSidePanelContent } = useSidePanel();

  const handleCreate = () => {
    setSidePanelContent(
      "Add removal profile",
      <SingleRemovalProfileForm action="add" />,
    );
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
    </PageMain>
  );
};

export default RemovalProfilesPage;
