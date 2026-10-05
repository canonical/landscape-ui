import { ProfileTypes } from "@/features/profiles";
import type { WslFeatureLimits } from "./types";

type WslLimitName = keyof WslFeatureLimits;

export interface WslLimitField {
  name: WslLimitName;
  label: string;
  /** What the server applies to an account without limits of its own. */
  defaultValue: number;
}

// Keyed by limit so that a limit added to `WslFeatureLimits` cannot be left
// out. The defaults mirror `DEFAULT_WSL_LIMITS` in `model/computer/child_limits.py`.
const WSL_LIMIT_DETAILS: Record<WslLimitName, Omit<WslLimitField, "name">> = {
  max_windows_host_machines: {
    label: "Windows host machines",
    defaultValue: 1000,
  },
  max_wsl_child_instances_per_host: {
    label: "WSL instances per host",
    defaultValue: 10,
  },
  max_wsl_child_instance_profiles: {
    label: "WSL instance profiles",
    defaultValue: 100,
  },
};

export const WSL_LIMIT_FIELDS: readonly WslLimitField[] = (
  Object.keys(WSL_LIMIT_DETAILS) as WslLimitName[]
).map((name) => ({ name, ...WSL_LIMIT_DETAILS[name] }));

export interface SupportProfilePage {
  /** The `profileType` route segment. */
  slug: string;
  type: ProfileTypes;
  label: string;
}

/**
 * The profile pages a support session can read: the ones whose endpoints
 * only need `ViewAccount`. WSL and USG profiles need grants support staff
 * do not hold inside an account they are not a member of.
 */
export const SUPPORT_PROFILE_PAGES: readonly [
  SupportProfilePage,
  ...SupportProfilePage[],
] = [
  {
    slug: "repository",
    type: ProfileTypes.repository,
    label: "Repository profiles",
  },
  { slug: "package", type: ProfileTypes.package, label: "Package profiles" },
  { slug: "upgrade", type: ProfileTypes.upgrade, label: "Upgrade profiles" },
  { slug: "reboot", type: ProfileTypes.reboot, label: "Reboot profiles" },
  { slug: "removal", type: ProfileTypes.removal, label: "Removal profiles" },
];

export interface SupportSettingsPage {
  /** The `setting` route segment. */
  slug: string;
  label: string;
}

/**
 * The org settings a support session can read: account preferences
 * (`ViewAccount`), administrators and invitations (`ViewPerson`,
 * `ViewInvitations`), roles (`ViewRole`) and access groups
 * (`ViewAccessContext`). Employees, identity providers and licenses need
 * grants support staff do not hold.
 */
export const SUPPORT_SETTINGS_PAGES: readonly SupportSettingsPage[] = [
  { slug: "general", label: "General" },
  { slug: "administrators", label: "Administrators" },
  { slug: "roles", label: "Roles" },
  { slug: "access-groups", label: "Access groups" },
];
