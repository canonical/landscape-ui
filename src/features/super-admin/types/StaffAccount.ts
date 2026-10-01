export interface StaffAccountAdministrator {
  name: string;
  email: string;
  openid: string | null;
}

export interface StaffAccountLicense {
  expires: string | null;
  seats: number;
  type: string;
}

/**
 * An account as listed for Canonical staff. `account` is the account name and
 * `company` its title, following the server's `get_state()` naming.
 */
export interface StaffAccountListItem {
  account: string;
  company: string;
  subdomain: string | null;
  disabled: boolean;
  computers: number;
  creation_time: string;
  salesforce_account_key: string | null;
  enabled_features: number[];
  lds_enabled: boolean;
}

/** Any account in the deployment, in full, as Canonical staff see it. */
export interface StaffAccount extends StaffAccountListItem {
  /** `null` unless the account is disabled. */
  disabled_reason: string | null;
  last_login_time: string | null;
  administrators: StaffAccountAdministrator[];
  licenses: StaffAccountLicense[];
  max_people_count: number;
  max_attachment_size: number;
}

export interface WslFeatureLimits {
  max_windows_host_machines: number;
  max_wsl_child_instances_per_host: number;
  max_wsl_child_instance_profiles: number;
}
