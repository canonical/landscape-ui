import { FC, lazy, Suspense } from "react";
import { Button } from "@canonical/react-components";
import EmptyState from "@/components/layout/EmptyState";
import LoadingState from "@/components/layout/LoadingState";
import useSidePanel from "@/hooks/useSidePanel";

const SupportedProviderList = lazy(() => import("../SupportedProviderList"));

const ProvidersEmptyState: FC = () => {
  const { setSidePanelContent } = useSidePanel();

  const handleIdentityProviderAdd = () => {
    setSidePanelContent(
      "Choose an identity provider",
      <Suspense fallback={<LoadingState />}>
        <SupportedProviderList />
      </Suspense>,
    );
  };

  return (
    <EmptyState
      body={
        <>
          <p className="u-no-margin--bottom">
            You haven’t added any identity providers yet.
          </p>
          <a
            href="https://ubuntu.com/landscape/docs/managing-computers"
            target="_blank"
            rel="nofollow noopener noreferrer"
          >
            How to manage computers in Landscape
          </a>
        </>
      }
      cta={[
        <Button
          appearance="positive"
          key="table-add-new-mirror"
          onClick={handleIdentityProviderAdd}
          type="button"
        >
          Add identity provider
        </Button>,
      ]}
      icon="profile"
      title="No identity providers"
    />
  );
};

export default ProvidersEmptyState;
