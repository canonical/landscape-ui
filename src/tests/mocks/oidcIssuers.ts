import type { OidcIssuer } from "@/features/oidc";

export const oidcIssuers: OidcIssuer[] = [
  {
    id: 1,
    url: "https://example.okta.com",
    provider: {
      provider_label: "Okta",
      provider_slug: "okta",
      supported_features: [],
    },
    available_features: [],
  },
  {
    id: 2,
    url: "https://example.okta.com",
    provider: {
      provider_label: "Okta",
      provider_slug: "okta",
      supported_features: [],
    },
    available_features: ["directory-import"],
  },
  {
    id: 3,
    url: "https://canonical.google.com",
    provider: {
      provider_label: "Google Workspace",
      provider_slug: "google-workspace",
      supported_features: ["directory-import"],
    },
    available_features: ["directory-import"],
  },
];
