import type { FC } from "react";
import { lazy } from "react";
import { Button } from "@canonical/react-components";
import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import SidePanel from "@/components/layout/SidePanel";
import {
  SupportedProviderList,
  useAuthHandle,
  useGetLoginMethods,
} from "@/features/auth";
import type { IdentityProvider } from "@/features/auth";
import IdentityProvidersContainer from "@/pages/dashboard/settings/identity-providers/IdentityProvidersContainer";
import usePageParams from "@/hooks/usePageParams";
import useSetDynamicFilterValidation from "@/hooks/useDynamicFilterValidation";

const ProviderForm = lazy(async () => import("@/features/auth/components/ProviderForm"));

const UBUNTU_ONE_PROVIDER: IdentityProvider = {
  enabled: true,
  id: -1,
  name: "Ubuntu One",
  provider: "ubuntu-one",
};

const IdentityProvidersPage: FC = () => {
  const {
    lastSidePathSegment,
    name,
    popSidePathUntilClear,
    createSidePathPusher,
  } = usePageParams();

  useSetDynamicFilterValidation("sidePath", ["choose", "add", "edit"]);

  const { getSupportedProvidersQuery } = useAuthHandle();
  const { data: supportedProvidersList } = getSupportedProvidersQuery();
  const supportedProviders = supportedProvidersList?.data.results ?? [];

  const { loginMethods } = useGetLoginMethods();

  const oidcAvailable = !!loginMethods?.oidc?.available;
  const ubuntuOneAvailable = !!loginMethods?.ubuntu_one?.available;
  const ubuntuOneEnabled = !!loginMethods?.ubuntu_one?.enabled;
  const oidcProviders = loginMethods?.oidc?.configurations ?? [];

  const providerData: IdentityProvider[] = [
    ...[{ ...UBUNTU_ONE_PROVIDER, enabled: ubuntuOneEnabled }].slice(
      ubuntuOneAvailable ? 0 : 1,
    ),
    ...oidcProviders.slice(oidcAvailable ? 0 : oidcProviders.length),
  ];

  const canBeDisabled = providerData.filter(({ enabled }) => enabled).length > 1;

  const foundSupportedProvider = supportedProviders.find(
    (p) => p.provider_slug === name
  );

  const foundEditProvider = providerData.find(
    (p) => String(p.id) === name
  );

  return (
    <PageMain>
      <PageHeader
        title="Identity Providers"
        actions={[
          <Button
            key="add-identity-provider"
            type="button"
            appearance="positive"
            onClick={createSidePathPusher("choose")}
          >
            Add identity provider
          </Button>,
        ]}
      />
      <PageContent>
        <IdentityProvidersContainer />
      </PageContent>

      <SidePanel
        onClose={popSidePathUntilClear}
        isOpen={!!lastSidePathSegment}
      >
        {lastSidePathSegment === "choose" && (
          <SidePanel.Suspense key="choose">
            <SidePanel.Header>Choose an identity provider</SidePanel.Header>
            <SidePanel.Content>
              <SupportedProviderList />
            </SidePanel.Content>
          </SidePanel.Suspense>
        )}

        {lastSidePathSegment === "add" && foundSupportedProvider && (
          <SidePanel.Suspense key="add">
            <SidePanel.Header>
              Add {foundSupportedProvider.provider_label} identity provider
            </SidePanel.Header>
            <SidePanel.Content>
              <ProviderForm action="add" provider={foundSupportedProvider} />
            </SidePanel.Content>
          </SidePanel.Suspense>
        )}

        {lastSidePathSegment === "edit" && foundEditProvider && (
          <SidePanel.Suspense key="edit">
            <SidePanel.Header>
              Edit {foundEditProvider.name} provider
            </SidePanel.Header>
            <SidePanel.Content>
              <ProviderForm
                action="edit"
                canBeDisabled={canBeDisabled}
                provider={foundEditProvider}
              />
            </SidePanel.Content>
          </SidePanel.Suspense>
        )}
      </SidePanel>
    </PageMain>
  );
};

export default IdentityProvidersPage;
