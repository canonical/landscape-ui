import { FC, lazy, Suspense } from "react";
import { Button } from "@canonical/react-components";
import LoadingState from "@/components/layout/LoadingState";
import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import useSidePanel from "@/hooks/useSidePanel";
import IdentityProvidersContainer from "@/pages/dashboard/settings/identity-providers/IdentityProvidersContainer";

const SupportedProviderList = lazy(() =>
  import("@/features/identity-providers").then((module) => ({
    default: module.SupportedProviderList,
  })),
);

const IdentityProvidersPage: FC = () => {
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
    <PageMain>
      <PageHeader
        title="Identity Providers"
        actions={[
          <Button
            key="add-identity-provider"
            type="button"
            appearance="positive"
            onClick={handleIdentityProviderAdd}
          >
            Add identity provider
          </Button>,
        ]}
      />
      <PageContent>
        <IdentityProvidersContainer />
      </PageContent>
    </PageMain>
  );
};

export default IdentityProvidersPage;
