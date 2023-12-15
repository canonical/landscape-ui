import { FC, lazy, Suspense } from "react";
import PageHeader from "../../../../components/layout/PageHeader";
import PageMain from "../../../../components/layout/PageMain";
import PageContent from "../../../../components/layout/PageContent";
import { Button } from "@canonical/react-components";
import LoadingState from "../../../../components/layout/LoadingState";
import EmptyState from "../../../../components/layout/EmptyState";
import useSidePanel from "../../../../hooks/useSidePanel";
import APTSourcesList from "./APTSourcesList";
import useAPTSources from "../../../../hooks/useAPTSources";

const NewAPTSourceForm = lazy(() => import("./NewAPTSourceForm"));

const APTSourcesPage: FC = () => {
  const { setSidePanelOpen, setSidePanelContent } = useSidePanel();
  const { getAPTSourcesQuery } = useAPTSources();

  const { data, isLoading } = getAPTSourcesQuery();

  const items = data?.data ?? [];

  const handleOpen = () => {
    setSidePanelOpen(true);
    setSidePanelContent(
      "Create APT source",
      <Suspense fallback={<LoadingState />}>
        <NewAPTSourceForm />
      </Suspense>,
    );
  };

  return (
    <PageMain>
      <PageHeader
        title="APT Sources"
        actions={[
          <Button
            key="new-key-button"
            appearance="positive"
            onClick={handleOpen}
            type="button"
          >
            Create APT source
          </Button>,
        ]}
      />
      <PageContent>
        {isLoading && <LoadingState />}
        {!isLoading && items.length === 0 && (
          <EmptyState
            title="No APT sources found"
            icon="connected"
            body={
              <>
                <p className="u-no-margin--bottom">
                  You haven’t added any APT sources yet.
                </p>
                <a href="https://ubuntu.com/landscape/docs/repositories">
                  How to manage APT sources in Landscape
                </a>
              </>
            }
            cta={[
              <Button
                appearance="positive"
                key="table-create-new-mirror"
                onClick={handleOpen}
                type="button"
              >
                Create APT source
              </Button>,
            ]}
          />
        )}
        {!isLoading && items.length > 0 && <APTSourcesList items={items} />}
      </PageContent>
    </PageMain>
  );
};

export default APTSourcesPage;
