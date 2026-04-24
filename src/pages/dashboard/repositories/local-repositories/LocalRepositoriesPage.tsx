import EmptyState from "@/components/layout/EmptyState";
import LoadingState from "@/components/layout/LoadingState";
import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import { APTSourcesList, useGetAPTSources } from "@/features/apt-sources";
import useSidePanel from "@/hooks/useSidePanel";
import { Button } from "@canonical/react-components";
import type { FC } from "react";
import { lazy, Suspense } from "react";
// import { GPG_KEYS_DOCS_URL } from "./constants";

const NewAPTSourceForm = lazy(async () =>
  import("@/features/apt-sources").then((module) => ({
    default: module.NewAPTSourceForm,
  })),
);

const APTSourcesPage: FC = () => {
  const { setSidePanelContent } = useSidePanel();
  const { aptSources: items, isGettingAPTSources: isLoading } =
    useGetAPTSources();

  const handleOpen = () => {
    setSidePanelContent(
      "Add APT source",
      <Suspense fallback={<LoadingState />}>
        <NewAPTSourceForm />
      </Suspense>,
    );
  };

  return (
    <PageMain>
      <PageHeader
        title="APT sources"
        actions={[
          <Button
            key="new-key-button"
            appearance="positive"
            onClick={handleOpen}
            type="button"
          >
            Add APT source
          </Button>,
        ]}
      />
      <PageContent hasTable>
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
                <a
                  href="#" // TODO: discard
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                >
                  How to manage APT sources in Landscape
                </a>
              </>
            }
            cta={[
              <Button
                appearance="positive"
                key="table-add-new-mirror"
                onClick={handleOpen}
                type="button"
              >
                Add APT source
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
