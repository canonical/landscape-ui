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
