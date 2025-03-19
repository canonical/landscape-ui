import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import {
  SecurityProfileAddForm,
  SecurityProfilesList,
} from "@/features/security-profiles";
import useSidePanel from "@/hooks/useSidePanel";
import { Button } from "@canonical/react-components";
import { type FC } from "react";

const SecurityProfilesPage: FC = () => {
  const { setSidePanelContent } = useSidePanel();

  const add = () => {
    setSidePanelContent("Add security profile", <SecurityProfileAddForm />);
  };

  return (
    <PageMain>
      <PageHeader
        title="Security profiles"
        actions={[
          <Button key="add" type="button" appearance="positive" onClick={add}>
            Add security profile
          </Button>,
        ]}
      />
      <PageContent>
        <SecurityProfilesList />
      </PageContent>
    </PageMain>
  );
};

export default SecurityProfilesPage;
