import type { OidcIssuer } from "@/features/oidc";
import type { OidcGroupImportSession } from "@/features/employee-groups";

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

export const oidcGroupImportSession: OidcGroupImportSession = {
  id: 4,
  status: "IN PROGRESS",
  issuer_id: 2,
  imported_at: "2025-02-02T17:55:23.806269",
};
