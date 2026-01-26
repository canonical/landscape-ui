import EmptyState from "@/components/layout/EmptyState";
import LoadingState from "@/components/layout/LoadingState";
import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import { GPGKeysList, useGPGKeys } from "@/features/gpg-keys";
import useSidePanel from "@/hooks/useSidePanel";
import { Button } from "@canonical/react-components";
import type { FC } from "react";
import { lazy, Suspense } from "react";

const NewGPGKeyForm = lazy(async () =>
  import("@/features/gpg-keys").then((module) => ({
    default: module.NewGPGKeyForm,
  })),
);

const GPGKeysPage: FC = () => {
  const { setSidePanelContent } = useSidePanel();
  const { getGPGKeysQuery } = useGPGKeys();

  const { data, isLoading } = getGPGKeysQuery();

  const items = data?.data ?? [];

  const handleOpen = () => {
    setSidePanelContent(
      "Import GPG key",
      <Suspense fallback={<LoadingState />}>
        <NewGPGKeyForm />
      </Suspense>,
    );
  };

  return (
    <PageMain>
      <PageHeader
        title="GPG keys"
        actions={[
          <Button
            key="new-key-button"
            appearance="positive"
            onClick={handleOpen}
            type="button"
            aria-label="Import GPG key"
          >
            Import key
          </Button>,
        ]}
      />
      <PageContent hasTable>
        {isLoading && <LoadingState />}
        {!isLoading && items.length === 0 && (
          <EmptyState
            title="No GPG keys found"
            icon="connected"
            body={
              <>
                <p className="u-no-margin--bottom">
                  You haven&apos;t added any GPG keys yet.
                </p>
                <a
                  href="https://ubuntu.com/landscape/docs/repositories"
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                >
                  How to manage GPG keys in Landscape
                </a>
              </>
            }
            cta={[
              <Button
                appearance="positive"
                key="table-add-new-mirror"
                onClick={handleOpen}
                type="button"
                aria-label="Import GPG key"
              >
                Import key
              </Button>,
            ]}
          />
        )}
        {!isLoading && items.length > 0 && <GPGKeysList items={items} />}
      </PageContent>
    </PageMain>
  );
};

export default GPGKeysPage;
