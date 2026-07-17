import type { FC } from "react";
import { lazy, Suspense } from "react";
import { Button } from "@canonical/react-components";
import EmptyState from "@/components/layout/EmptyState";
import LoadingState from "@/components/layout/LoadingState";
import useSidePanel from "@/hooks/useSidePanel";
import { MANAGING_COMPUTERS_DOCUMENTATION_URL } from "./constants";

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
      body="You haven’t added any identity providers yet."
      link={{
        href: MANAGING_COMPUTERS_DOCUMENTATION_URL,
        text: "How to manage computers in Landscape",
      }}
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
