import { ROOT_PATH } from "@/constants";
import type {
  IdentityProvider,
  SupportedIdentityProvider,
} from "@/features/auth";
import { mapTuple } from "@/utils/_helpers";

export const identityProviders = [
  {
    name: "Okta Enabled",
    provider: "okta",
    enabled: true,
    id: 1,
  },
  {
    name: "Okta Disabled",
    provider: "okta",
    enabled: false,
    id: 2,
  },
  {
    name: "Google Workspace",
    provider: "google",
    enabled: true,
    id: 3,
  },
] as const satisfies IdentityProvider[];

const oktaProviderConfiguration = {
  _schema: "",
  client_id: "client_id",
  client_secret: "client_secret",
  discovery_enabled: true,
  discovery_uri: "https://okta.com/.well-known/openid-configuration",
  issuer: "https://okta.com/",
  name: "",
  provider: "okta" as const,
  scopes: ["openid", "email"],
};

export const singleIdentityProviders = mapTuple(
  identityProviders,
  (provider) => ({
    configuration: { ...oktaProviderConfiguration, name: provider.name },
    enabled: provider.enabled,
    id: provider.id,
    redirect_uri: "http://onward.landscape.yuriy.works/handle-auth/oidc",
  }),
);

export const supportedProviders = [
  {
    provider_slug: "okta",
    provider_label: "Okta",
    redirect_uri: "http://onward.landscape.yuriy.works/handle-auth/oidc",
    supported_features: ["directory-import"],
  },
  {
    provider_slug: "ubuntu-one",
    provider_label: "Ubuntu One",
    redirect_uri: "http://onward.landscape.yuriy.works/handle-auth/ubuntu-one",
    supported_features: [],
  },
] as const satisfies SupportedIdentityProvider[];

export const oidcLocationToRedirectTo = `${ROOT_PATH}handle-auth/oidc?code=oidc-code&state=state123`;
