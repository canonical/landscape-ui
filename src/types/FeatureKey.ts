export type ServerFeatureKey =
  | "computer-soft-deletion"
  | "employee-management"
  | "instance-reports"
  | "oidc-configuration"
  | "package-search-rest-api"
  | "script-profiles"
  | "spa-dashboard"
  | "support-provider-login"
  | "ubuntu-pro-licensing"
  | "usg-profiles"
  | "wsl-child-instance-profiles";

export type DebarchiveFeatureKey = "temporal-lros";

export type FeatureKey = ServerFeatureKey | DebarchiveFeatureKey;
