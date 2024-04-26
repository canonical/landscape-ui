import { FC, lazy, Suspense } from "react";
import { Button } from "@canonical/react-components";
import LoadingState from "@/components/layout/LoadingState";
import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import useSidePanel from "@/hooks/useSidePanel";
import ScriptsContainer from "@/pages/dashboard/scripts/ScriptsContainer";

const SingleScript = lazy(() =>
  import("@/features/scripts").then((module) => ({
    default: module.SingleScript,
  })),
);

const ScriptsPage: FC = () => {
  const { setSidePanelContent } = useSidePanel();

  const handleScriptCreate = () => {
    setSidePanelContent(
      "Add script",
      <Suspense fallback={<LoadingState />}>
        <SingleScript action="add" />
      </Suspense>,
    );
  };

  return (
    <PageMain>
      <PageHeader
        title="Scripts"
        actions={[
          <Button
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
