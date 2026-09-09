// Mock data for the staff (super admin) account endpoints, mirroring the
// server's `get_staff_account_page` / `get_staff_account_detail` shapes: the
// detail is `Account.get_state()` (including its always-null legacy fields)
// plus the two account limits, and the list is a slim projection of it.

export interface StaffAccountAdministrator {
  name: string;
  email: string;
  openid: string | null;
}

export interface StaffAccountLicense {
  expires: string;
  seats: number;
  type: string;
}

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

export interface StaffAccount extends StaffAccountListItem {
  creator: null;
  company_size: null;
  daytime_phone: null;
  country: null;
  region: null;
  mailing_list_optin: null;
  administrators: StaffAccountAdministrator[];
  last_login_time: string | null;
  licenses: StaffAccountLicense[];
  disabled_reason?: string;
  max_people_count: number;
  max_attachment_size: number;
}

export interface WslFeatureLimits {
  max_windows_host_machines: number;
  max_wsl_child_instances_per_host: number;
  max_wsl_child_instance_profiles: number;
}

const legacyNullFields = {
  creator: null,
  company_size: null,
  daytime_phone: null,
  country: null,
  region: null,
  mailing_list_optin: null,
} as const;

/**
 * Every account in the mock deployment, sorted by name like the server's
 * list query. Includes the two accounts the mock auth user is a member of
 * (`test-account`, `second-account` — see `mocks/auth.ts`) plus non-member
 * accounts covering the staff-only states: a disabled account, an account
 * with a Salesforce key, and an account whose login policy requires
 * re-authentication (see `reauthenticationRequiredAccounts`).
 *
 * A factory rather than a constant: handlers mutate their copy (PATCH), so
 * each test run starts from a fresh deep copy.
 */
export const createStaffAccounts = (): StaffAccount[] => [
  {
    ...legacyNullFields,
    account: "acme",
    company: "ACME Corp",
    subdomain: "acme",
    disabled: false,
    computers: 41,
    creation_time: "2024-01-01T00:00:00Z",
    last_login_time: "2026-07-01T09:30:00Z",
    administrators: [{ name: "Jane Doe", email: "jane@acme.com", openid: null }],
    licenses: [
      { expires: "2027-01-01T00:00:00Z", seats: 50, type: "UbuntuPro" },
    ],
    lds_enabled: false,
    salesforce_account_key: "1-001A1B2C3D4E5F0",
    enabled_features: [4, 7],
    max_people_count: 10,
    max_attachment_size: 1048576,
  },
  {
    ...legacyNullFields,
    account: "globex",
    company: "Globex Corporation",
    subdomain: null,
    disabled: false,
    computers: 7,
    creation_time: "2025-03-15T12:00:00Z",
    last_login_time: "2026-08-20T16:45:00Z",
    administrators: [
      { name: "Hank Scorpio", email: "hank@globex.com", openid: null },
    ],
    licenses: [],
    lds_enabled: false,
    salesforce_account_key: null,
    enabled_features: [],
    max_people_count: 10,
    max_attachment_size: 1048576,
  },
  {
    ...legacyNullFields,
    account: "initech",
    company: "Initech",
    subdomain: null,
    disabled: true,
    disabled_reason: "Payment overdue",
    computers: 0,
    creation_time: "2023-06-30T08:00:00Z",
    last_login_time: null,
    administrators: [
      { name: "Bill Lumbergh", email: "bill@initech.com", openid: null },
    ],
    licenses: [],
    lds_enabled: false,
    salesforce_account_key: null,
    enabled_features: [],
    max_people_count: 5,
    max_attachment_size: 1048576,
  },
  {
    ...legacyNullFields,
    account: "second-account",
    company: "Second Account",
    subdomain: null,
    disabled: false,
    computers: 3,
    creation_time: "2025-01-10T10:00:00Z",
    last_login_time: "2026-09-01T11:00:00Z",
    administrators: [
      { name: "Test User", email: "example@mail.com", openid: null },
    ],
    licenses: [],
    lds_enabled: false,
    salesforce_account_key: null,
    enabled_features: [],
    max_people_count: 10,
    max_attachment_size: 1048576,
  },
  {
    ...legacyNullFields,
    account: "test-account",
    company: "Test Account",
    subdomain: null,
    disabled: false,
    computers: 12,
    creation_time: "2024-11-05T09:00:00Z",
    last_login_time: "2026-09-08T07:15:00Z",
    administrators: [
      { name: "Test User", email: "example@mail.com", openid: null },
    ],
    licenses: [
      { expires: "2026-12-31T00:00:00Z", seats: 20, type: "LDSBasic" },
    ],
    lds_enabled: true,
    salesforce_account_key: null,
    enabled_features: [1, 2],
    max_people_count: 10,
    max_attachment_size: 1048576,
  },
];

/**
 * Accounts whose `login_policy.requires_account_authentication` is set. Not
 * part of any API resource — it only drives the `POST switch-account` 401 for
 * non-staff members (staff bypass the policy).
 */
export const reauthenticationRequiredAccounts = ["globex"];

/** Server-side defaults (`model/computer/child_limits.py`). */
export const defaultWslFeatureLimits: WslFeatureLimits = {
  max_windows_host_machines: 1000,
  max_wsl_child_instances_per_host: 10,
  max_wsl_child_instance_profiles: 100,
};
