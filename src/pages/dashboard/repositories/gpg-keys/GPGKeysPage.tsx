import { FC } from "react";
import PageHeader from "../../../../components/layout/PageHeader";
import PageMain from "../../../../components/layout/PageMain";
import PageContent from "../../../../components/layout/PageContent";
import { Button } from "@canonical/react-components";
import LoadingState from "../../../../components/layout/LoadingState";
import EmptyState from "../../../../components/layout/EmptyState";
import useSidePanel from "../../../../hooks/useSidePanel";
import NewGPGKeyForm from "./NewGPGKeyForm";
import GPGKeysList from "./GPGKeysList";
import useGPGKeys from "../../../../hooks/useGPGKeys";

const GPGKeysPage: FC = () => {
  const { setSidePanelOpen, setSidePanelContent } = useSidePanel();
  const { getGPGKeysQuery } = useGPGKeys();

  const { data, isLoading } = getGPGKeysQuery();

  const items = data?.data ?? [];

  const handleOpen = () => {
    setSidePanelOpen(true);
    setSidePanelContent("Import GPG key", <NewGPGKeyForm />);
  };

  return (
    <PageMain>
      <PageHeader
        title="GPG Keys"
        actions={[
          <Button
            key="new-key-button"
            appearance="positive"
            onClick={handleOpen}
            type="button"
          >
            Import key
          </Button>,
        ]}
      />
      <PageContent>
        {isLoading && <LoadingState />}
        {!isLoading && items.length === 0 && (
          <EmptyState
            title="No GPG keys found"
            icon="connected"
            body={
              <>
                <p className="u-no-margin--bottom">
                  You haven’t added any GPG keys yet.
                </p>
                <a href="https://ubuntu.com/landscape/docs/repositories">
                  How to manage GPG keys in Landscape
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
