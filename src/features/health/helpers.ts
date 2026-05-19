import type { Instance, InstanceWithoutRelation } from "@/types/Instance";
import type {
  ComputerHealth,
  HealthFactor,
  HealthActionKind,
  HealthBand,
} from "./types";

// Health is computed from signals the Landscape client reports. The client
// only runs on Ubuntu (server / desktop / core / WSL), so anything else —
// Windows hosts, Debian, "other Linux" — has no score to surface. Fresh
// Ubuntu instances that haven't reported yet still count as measurable: the
// server returns the score-100 placeholder per the spec.
//
// We key off `description` ("Ubuntu 24.04 LTS", "Ubuntu Core 24", …) rather
// than `distributor` because the latter is inconsistent in real data
// ("Ubuntu", "Ubuntu Core", "Canonical" all appear for Ubuntu instances).
// `description` is the human-facing OS line and reliably contains "Ubuntu"
// for every flavour that runs the agent.
export const isHealthMeasurable = (
  instance: Pick<
    InstanceWithoutRelation,
    "distribution_info" | "is_wsl_instance"
  > & { distribution?: string | null },
): boolean => {
  const info = instance.distribution_info;
  if (!info) {
    // No OS info reported yet — treat as measurable; the score endpoint
    // returns the 100/healthy placeholder for the empty case.
    return true;
  }
  const description = info.description?.toLowerCase() ?? "";
  if (description.includes("ubuntu")) return true;
  const distributor = info.distributor?.toLowerCase() ?? "";
  // Fallback for fixtures or older instances that report only the
  // distributor field. "Canonical" is the upstream packager and is
  // always Ubuntu-family; "Ubuntu" and "Ubuntu Core" cover the common
  // cases explicitly.
  return distributor.startsWith("ubuntu") || distributor === "canonical";
};

// Maps a health factor to the most useful remediation action. Used by the
// Health tab to surface the "next thing to do" without making the operator
// guess. A factor without a mapped action falls through to the always-on
// diagnostic script.
const ACTION_BY_RULE_KEY: Record<string, HealthActionKind> = {
  "usn.critical": "run-security-updates",
  "usn.high": "run-security-updates",
  "usn.medium": "run-security-updates",
  "usn.low": "run-security-updates",
  reboot_required: "reboot",
  "instance.offline": "refresh-facts",
  "package.updates_available": "run-security-updates",
};

export const suggestedActionFor = (
  factor: HealthFactor,
): HealthActionKind | null => ACTION_BY_RULE_KEY[factor.rule_key] ?? null;

export const recommendedActionsFor = (
  factors: HealthFactor[],
): HealthActionKind[] => {
  const seen = new Set<HealthActionKind>();
  for (const factor of factors) {
    const action = suggestedActionFor(factor);
    if (action && !seen.has(action)) {
      seen.add(action);
    }
  }
  // The diagnostic script is always offered — useful when the score is fine
  // and the operator just wants to gather facts. Phase 1.7 keeps this in
  // the fallback path only; production responses come from the server's
  // `recommended_actions` field which omits diagnostic-script for now.
  seen.add("run-diagnostic-script");
  return Array.from(seen);
};

// LA061 Phase 1.7: prefer the server's `recommended_actions` field when
// present. An explicit empty array is meaningful ("nothing to do") and
// must not fall back. Undefined means "field not present on the response"
// — older server, cached payload, or MSW handler that hasn't been updated
// — and falls back to the local helper for graceful degradation.
export const effectiveRecommendedActions = (
  health: Pick<ComputerHealth, "factors" | "recommended_actions">,
): HealthActionKind[] => {
  if (health.recommended_actions !== undefined) {
    return health.recommended_actions;
  }
  return recommendedActionsFor(health.factors);
};

interface HealthActionMeta {
  label: string;
  icon: string;
  description: string;
}

export const HEALTH_ACTION_META: Record<HealthActionKind, HealthActionMeta> = {
  "run-security-updates": {
    label: "Run security updates",
    icon: "security-tick",
    description:
      "Queues an apt upgrade limited to packages with pending USNs.",
  },
  reboot: {
    label: "Reboot now",
    icon: "restart",
    description: "Schedules a graceful reboot via systemd.",
  },
  "refresh-facts": {
    label: "Refresh facts",
    icon: "begin-downloading",
    description:
      "Forces a fresh check-in so stale data clears as soon as the agent reports.",
  },
  "attach-ubuntu-pro": {
    label: "Attach Ubuntu Pro",
    icon: "lock-locked",
    description:
      "Enrols the instance into Ubuntu Pro, enabling Livepatch and ESM.",
  },
  "run-diagnostic-script": {
    label: "Run diagnostic script",
    icon: "code",
    description:
      "Collects logs and runtime state into a downloadable bundle.",
  },
};

export const isInstanceMeasurable = (
  instance: Instance | InstanceWithoutRelation,
): boolean => isHealthMeasurable(instance);

export const BAND_LABEL: Record<HealthBand, string> = {
  critical: "Critical",
  warning: "Warning",
  healthy: "Healthy",
};

// Glyphs to render alongside band labels. Sourced from
// `@canonical/react-components`'s built-in icon set so we don't ship any new
// assets. Mapping is purposely tight: red x, amber warning, green tick.
export const BAND_ICON: Record<HealthBand, string> = {
  critical: "error",
  warning: "warning",
  healthy: "success",
};
