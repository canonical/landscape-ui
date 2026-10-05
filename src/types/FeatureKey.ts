type ServerFeatureKey =
  | "computer-soft-deletion"
  | "employee-management"
  | "instance-reports"
  | "oidc-configuration"
  | "script-profiles"
  | "spa-dashboard"
  | "support-provider-login"
  | "ubuntu-pro-licensing"
  | "usg-profiles"
  | "wsl-child-instance-profiles";

type DebarchiveFeatureKey = "persistent-lros";

export type FeatureKey = ServerFeatureKey | DebarchiveFeatureKey;
