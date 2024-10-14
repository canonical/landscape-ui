import { FC } from "react";
import { Button } from "@canonical/react-components";
import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import { SingleScript } from "@/features/scripts";
import useSidePanel from "@/hooks/useSidePanel";
import ScriptsContainer from "@/pages/dashboard/scripts/ScriptsContainer";

const ScriptsPage: FC = () => {
  const { setSidePanelContent } = useSidePanel();

  const handleScriptCreate = () => {
    setSidePanelContent("Add script", <SingleScript action="add" />);
  };

  return (
    <PageMain>
      <PageHeader
        title="Scripts"
        actions={[
          <Button
            type="button"
            key="add-script"
            appearance="positive"
            onClick={handleScriptCreate}
          >
            Add script
          </Button>,
        ]}
      />
      <PageContent>
        <ScriptsContainer />
      </PageContent>
    </PageMain>
  );
};

export default ScriptsPage;
