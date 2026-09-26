// Mock data for the staff (super admin) endpoints, mirroring the server's
// response models: the account detail (`SuperadminAccountResponse`, i.e. the
// `Account.get_state()` fields plus the two account limits), its slim list
// projection, and the `GET people` search results. Accounts, people and
// invitations describe one deployment, so memberships, administrators and
// invitation targets agree across endpoints.

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

/**
 * Every account in the mock deployment, sorted by name like the server's
 * list query. Includes the two accounts the mock auth user is a member of
 * (`test-account`, `second-account` — see `mocks/auth.ts`) plus non-member
 * accounts covering the staff-only states: a disabled account, an account
 * with a Salesforce key, an account whose login policy requires
 * re-authentication (see `reauthenticationRequiredAccounts`), and the stray
 * free account a customer signed up for next to their Salesforce-linked one
 * (`jane-free-1`, see `staffPeople`).
 *
 * A factory rather than a constant: handlers mutate their copy (PATCH), so
 * each test run starts from a fresh deep copy.
 */
export const createStaffAccounts = (): StaffAccount[] => [
  {
    account: "acme",
    company: "ACME Corp",
    subdomain: "acme",
    disabled: false,
    disabled_reason: null,
    computers: 41,
    creation_time: "2024-01-01T00:00:00Z",
    last_login_time: "2026-07-01T09:30:00Z",
    administrators: [
      {
        name: "Jane Doe",
        email: "jane@acme.com",
        openid: "https://login.ubuntu.com/+id/abc123",
      },
    ],
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
    account: "globex",
    company: "Globex Corporation",
    subdomain: null,
    disabled: false,
    disabled_reason: null,
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
    account: "jane-free-1",
    company: "Jane's free account",
    subdomain: "janedoe",
    disabled: false,
    disabled_reason: null,
    computers: 1,
    creation_time: "2026-08-30T15:02:10Z",
    last_login_time: "2026-09-01T08:12:44Z",
    administrators: [
      {
        name: "Jane Doe",
        email: "jane@acme.com",
        openid: "https://login.ubuntu.com/+id/abc123",
      },
    ],
    licenses: [],
    lds_enabled: false,
    salesforce_account_key: null,
    enabled_features: [],
    max_people_count: 10,
    max_attachment_size: 1048576,
  },
  {
    account: "second-account",
    company: "Second Account",
    subdomain: null,
    disabled: false,
    disabled_reason: null,
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
    account: "test-account",
    company: "Test Account",
    subdomain: null,
    disabled: false,
    disabled_reason: null,
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

// --- People search (`GET people`) ---
//
// Person and invitation timestamps are naive UTC with microseconds and no
// `Z`: unlike the account endpoints, the people search serializes the raw
// `timestamp` columns instead of going through `format_datetime`.

export interface StaffPersonAccount {
  account: string;
  company: string;
  salesforce_account_key: string | null;
}

export interface StaffPendingInvitation {
  account: string;
  company: string;
  creation_time: string;
}

export interface StaffPersonResult {
  type: "person";
  id: number;
  name: string;
  email: string;
  /** The SSO identity; `null` when the person never completed an SSO login. */
  identity: string | null;
  last_login_time: string | null;
  accounts: StaffPersonAccount[];
  /** Invitations addressed to this person's email, in any account. */
  pending_invitations: StaffPendingInvitation[];
}

export interface StaffInvitationResult {
  type: "invitation";
  id: number;
  name: string;
  email: string;
  account: string;
  company: string;
  salesforce_key: string | null;
  creation_time: string;
}

export type StaffPeopleResult = StaffPersonResult | StaffInvitationResult;

/** A `person` row, with the names of the accounts it belongs to. */
export interface StaffPersonRow {
  id: number;
  name: string;
  email: string;
  identity: string | null;
  last_login_time: string | null;
  accounts: string[];
}

/** An `account_invitation` row; `account` names the target account. */
export interface StaffInvitationRow {
  id: number;
  name: string;
  email: string;
  account: string;
  salesforce_key: string | null;
  creation_time: string;
}

/**
 * Every person in the mock deployment, covering the support cases the people
 * search exists for: Jane Doe belongs to her Salesforce-linked account and to
 * a stray free one, has a duplicate record (same email, no SSO identity, no
 * account), and Milton Waddams is orphaned (no account left). Test User is the
 * mock caller (`mocks/auth.ts`).
 */
export const staffPeople: StaffPersonRow[] = [
  {
    id: 4821,
    name: "Jane Doe",
    email: "jane@acme.com",
    identity: "https://login.ubuntu.com/+id/abc123",
    last_login_time: "2026-09-01T08:12:44.512934",
    accounts: ["acme", "jane-free-1"],
  },
  {
    id: 5107,
    name: "Jane Doe",
    email: "jane@acme.com",
    identity: null,
    last_login_time: null,
    accounts: [],
  },
  {
    id: 1203,
    name: "Hank Scorpio",
    email: "hank@globex.com",
    identity: null,
    last_login_time: "2026-08-20T16:45:00.103872",
    accounts: ["globex"],
  },
  {
    id: 877,
    name: "Bill Lumbergh",
    email: "bill@initech.com",
    identity: null,
    last_login_time: null,
    accounts: ["initech"],
  },
  {
    id: 902,
    name: "Milton Waddams",
    email: "milton@initech.com",
    identity: "https://login.ubuntu.com/+id/mw0042",
    last_login_time: "2025-11-14T17:03:21.448210",
    accounts: [],
  },
  {
    id: 1001,
    name: "Test User",
    email: "example@mail.com",
    identity: null,
    last_login_time: "2026-09-08T07:15:00.261437",
    accounts: ["second-account", "test-account"],
  },
];

/**
 * Every pending invitation in the mock deployment: one to a mistyped address
 * that never became a person, one to Jane Doe's address in different case
 * (listed under both of her records), and one carrying a Salesforce key, which
 * the search matches exactly.
 */
export const staffInvitations: StaffInvitationRow[] = [
  {
    id: 913,
    name: "Jane Doe",
    email: "jane.doe@acme.com",
    account: "acme",
    salesforce_key: null,
    creation_time: "2026-08-30T15:00:00.284113",
  },
  {
    id: 914,
    name: "Jane Doe",
    email: "Jane@acme.com",
    account: "globex",
    salesforce_key: null,
    creation_time: "2026-09-10T09:30:12.771020",
  },
  {
    id: 920,
    name: "Peter Gibbons",
    email: "peter@initech.com",
    account: "initech",
    salesforce_key: "1-001P3T3RG1BB0N5",
    creation_time: "2026-06-02T13:45:09.930551",
  },
];
