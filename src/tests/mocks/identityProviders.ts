import {
  IdentityProvider,
  SingleIdentityProvider,
  SupportedIdentityProvider,
} from "@/features/auth";
import { InvitationSummary } from "@/types/Invitation";

export const identityProviders: IdentityProvider[] = [
  {
    name: "Okta test",
    provider: "okta",
    enabled: false,
    id: 16,
  },
  {
    name: "Okta Onward",
    provider: "okta",
    enabled: true,
    id: 19,
  },
  {
    name: "Okta Auth0 Dev",
    provider: "okta",
    enabled: true,
    id: 22,
  },
  {
    name: "Test Okta",
    provider: "okta",
    enabled: false,
    id: 18,
  },
];

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

export const singleIdentityProviders: SingleIdentityProvider[] =
  identityProviders.map((provider) => ({
    configuration: { ...oktaProviderConfiguration, name: provider.name },
    enabled: provider.enabled,
    id: provider.id,
    redirect_uri: "http://onward.landscape.yuriy.works/handle-auth/oidc",
  }));

export const supportedProviders: SupportedIdentityProvider[] = [
  {
    provider_slug: "okta",
    provider_label: "Okta",
    redirect_uri: "http://onward.landscape.yuriy.works/handle-auth/oidc",
  },
  {
    provider_slug: "ubuntu-one",
    provider_label: "Ubuntu One",
    redirect_uri: "http://onward.landscape.yuriy.works/handle-auth/ubuntu-one",
  },
];

export const invitations: InvitationSummary[] = [
  {
    account_title: "Onward, Inc.",
    secure_id: "1",
  },
  {
    account_title: "Onward, Inc.",
    secure_id: "2",
  },
  {
    account_title: "Onward, Inc.",
    secure_id: "3",
  },
];

export const locationToRedirectTo = "http://example.com";
