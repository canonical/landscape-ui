export type ServerFeatureKey =
  | "computer-soft-deletion"
  | "employee-management"
  | "instance-reports"
  | "oidc-configuration"
  | "package-change-plans"
  | "package-search-rest-api"
  | "script-profiles"
  | "spa-dashboard"
  | "support-provider-login"
  | "support-sessions"
  | "ubuntu-pro-licensing"
  | "usg-profiles"
  | "wsl-child-instance-profiles"
  | "repository-mirrors";

export type DebarchiveFeatureKey = "temporal-lros";

export type FeatureKey = ServerFeatureKey | DebarchiveFeatureKey;
