import { FC } from "react";
import { Button } from "@canonical/react-components";
import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import { SupportedProviderList } from "@/features/auth";
import useSidePanel from "@/hooks/useSidePanel";
import IdentityProvidersContainer from "@/pages/dashboard/settings/identity-providers/IdentityProvidersContainer";

const IdentityProvidersPage: FC = () => {
  const { setSidePanelContent } = useSidePanel();

  const handleIdentityProviderAdd = () => {
    setSidePanelContent(
      "Choose an identity provider",
      <SupportedProviderList />,
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
