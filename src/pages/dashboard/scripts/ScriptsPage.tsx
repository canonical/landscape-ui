import { FC, lazy, Suspense } from "react";
import PageMain from "../../../components/layout/PageMain";
import PageHeader from "../../../components/layout/PageHeader";
import PageContent from "../../../components/layout/PageContent";
import ScriptsContainer from "./ScriptsContainer";
import { Button } from "@canonical/react-components";
import useSidePanel from "../../../hooks/useSidePanel";
import LoadingState from "../../../components/layout/LoadingState";

const SingleScript = lazy(() => import("./SingleScript"));

const ScriptsPage: FC = () => {
  const { setSidePanelContent } = useSidePanel();

  return (
    <PageMain>
      <PageHeader
        title="Scripts"
        actions={[
          <Button
            key="create-script"
            appearance="positive"
            onClick={() => {
              setSidePanelContent(
                "Create script",
                <Suspense fallback={<LoadingState />}>
                  <SingleScript action="create" />
                </Suspense>,
              );
            }}
          >
            Create script
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
