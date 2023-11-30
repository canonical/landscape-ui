import { FC } from "react";
import PageMain from "../../../../components/layout/PageMain";
import PageHeader from "../../../../components/layout/PageHeader";
import PageContent from "../../../../components/layout/PageContent";
import SavedSearchesContainer from "./SavedSearchesContainer";
import useSidePanel from "../../../../hooks/useSidePanel";
import SingleSavedSearch from "./SingleSavedSearch";
import { Button } from "@canonical/react-components";

const SavedSearchesPage: FC = () => {
  const { setSidePanelOpen, setSidePanelContent } = useSidePanel();

  return (
    <PageMain>
      <PageHeader
        title="Saved searches"
        sticky
        actions={[
          <Button
            key="create-saved-search"
            appearance="positive"
            onClick={() => {
              setSidePanelContent("Create saved search", <SingleSavedSearch />);
              setSidePanelOpen(true);
            }}
            aria-label="Create saved search"
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
