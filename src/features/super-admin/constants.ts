import type { WslFeatureLimits } from "./types";

export interface WslLimitField {
  name: keyof WslFeatureLimits;
  label: string;
  /** What the server applies to an account without limits of its own. */
  defaultValue: number;
}

// The defaults mirror `DEFAULT_WSL_LIMITS` in `model/computer/child_limits.py`.
export const WSL_LIMIT_FIELDS: readonly WslLimitField[] = [
  {
    name: "max_windows_host_machines",
    label: "Windows host machines",
    defaultValue: 1000,
  },
  {
    name: "max_wsl_child_instances_per_host",
    label: "WSL instances per host",
    defaultValue: 10,
  },
  {
    name: "max_wsl_child_instance_profiles",
    label: "WSL instance profiles",
    defaultValue: 100,
  },
];
