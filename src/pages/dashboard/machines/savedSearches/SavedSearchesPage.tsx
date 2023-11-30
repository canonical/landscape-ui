import { FC, lazy, Suspense } from "react";
import PageMain from "../../../../components/layout/PageMain";
import PageHeader from "../../../../components/layout/PageHeader";
import PageContent from "../../../../components/layout/PageContent";
import SavedSearchesContainer from "./SavedSearchesContainer";
import useSidePanel from "../../../../hooks/useSidePanel";
import { Button } from "@canonical/react-components";
import LoadingState from "../../../../components/layout/LoadingState";

const SingleSavedSearch = lazy(() => import("./SingleSavedSearch"));

const SavedSearchesPage: FC = () => {
  const { setSidePanelOpen, setSidePanelContent } = useSidePanel();

  return (
    <PageMain>
      <PageHeader
        title="Saved searches"
        sticky
        actions={[
          <Button
            key="create-search"
            appearance="positive"
            onClick={() => {
              setSidePanelContent(
                "Create search",
                <Suspense fallback={<LoadingState />}>
                  <SingleSavedSearch />
                </Suspense>,
              );
              setSidePanelOpen(true);
            }}
            aria-label="Create search"
          >
            <span>Create search</span>
          </Button>,
        ]}
      />
      <PageContent>
        <SavedSearchesContainer />
      </PageContent>
    </PageMain>
  );
};

export default SavedSearchesPage;
