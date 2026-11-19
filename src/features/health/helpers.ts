import type { Instance, InstanceWithoutRelation } from "@/types/Instance";
import type {
  HealthActionKind,
  HealthBand,
  HealthFactor,
  HealthStaleReason,
  MeasuredComputerHealth,
} from "./types";

// Health is computed from signals the Landscape client reports. The client
// only runs on Ubuntu (server / desktop / core / WSL), so anything else —
// Windows hosts, Debian, "other Linux" — has no score to surface. This is a
// client-side guess used to skip a request or hide a tab; the server's
// `measurable` field is the answer once a response is in hand.
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
    // No OS info reported yet. Ask the server, which answers
    // `measurable: false` until the first package report.
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
  "usn.unrated": "run-security-updates",
  reboot_required: "reboot",
  "instance.offline": "refresh-facts",
  "package.updates_available": "run-security-updates",
};

export const suggestedActionFor = (
  factor: HealthFactor,
): HealthActionKind | null => ACTION_BY_RULE_KEY[factor.rule_key] ?? null;

/** Returns the display text of a rule, falling back to its key. */
export const ruleTitle = (
  rule: Pick<HealthFactor, "rule_key"> & { title?: string },
): string => rule.title || rule.rule_key;

/** Returns how many of the factor's fixes are installed and wait for a reboot. */
export const pendingRebootCount = (
  factor: Pick<HealthFactor, "pending_reboot_count">,
): number => factor.pending_reboot_count ?? 0;

/** Returns the actions that clear a factor, a reboot first when fixes wait for one. */
export const actionsForFactor = (factor: HealthFactor): HealthActionKind[] => {
  const action = suggestedActionFor(factor);
  const pending = pendingRebootCount(factor);
  if (pending === 0) {
    return action ? [action] : [];
  }
  // With every fix installed, an update would change nothing.
  const isAllPending = pending >= factor.count;
  return action && !isAllPending ? ["reboot", action] : ["reboot"];
};

export const recommendedActionsFor = (
  factors: HealthFactor[],
): HealthActionKind[] => {
  const seen = new Set<HealthActionKind>();
  for (const factor of factors) {
    for (const action of actionsForFactor(factor)) {
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

// Prefers `recommended_actions` when the response carries it. An explicit
// empty array means "nothing to do" and must not fall back. The field is not
// in the Phase 1 contract, so a real server omits it and the local helper
// answers.
export const effectiveRecommendedActions = (
  health: Pick<MeasuredComputerHealth, "factors" | "recommended_actions">,
): HealthActionKind[] => {
  if (health.recommended_actions !== undefined) {
    return health.recommended_actions;
  }
  return recommendedActionsFor(health.factors);
};

interface HealthActionMeta {
  label: string;
  cta: string;
  icon: string;
  description: string;
}

export const HEALTH_ACTION_META: Record<HealthActionKind, HealthActionMeta> = {
  "run-security-updates": {
    label: "Run security updates",
    cta: "Run updates",
    icon: "security-tick",
    description: "Queues an apt upgrade limited to packages with pending USNs.",
  },
  reboot: {
    label: "Reboot now",
    cta: "Reboot",
    icon: "restart",
    description: "Schedules a graceful reboot via systemd.",
  },
  "refresh-facts": {
    label: "Refresh facts",
    cta: "Refresh",
    icon: "begin-downloading",
    description:
      "Forces a fresh check-in so stale data clears as soon as the agent reports.",
  },
  "attach-ubuntu-pro": {
    label: "Attach Ubuntu Pro",
    cta: "Attach",
    icon: "lock-locked",
    description:
      "Enrols the instance into Ubuntu Pro, enabling Livepatch and ESM.",
  },
  "run-diagnostic-script": {
    label: "Run diagnostic script",
    cta: "Run script",
    icon: "code",
    description: "Collects logs and runtime state into a downloadable bundle.",
  },
};

export const isInstanceMeasurable = (
  instance: Instance | InstanceWithoutRelation,
): boolean => isHealthMeasurable(instance);

const STALE_REASON_TEXT: Record<HealthStaleReason, string> = {
  inputs: "This instance has not reported recently.",
  rules: "The rules changed and the score is being recalculated.",
  engine: "Scoring was updated and the score is being recalculated.",
};

/** Returns why a score may be out of date, or null when it is current. */
export const staleReasonText = (
  health: Pick<MeasuredComputerHealth, "stale_reason">,
): string | null =>
  health.stale_reason ? STALE_REASON_TEXT[health.stale_reason] : null;

// Default band thresholds, for places with no summary response in hand. The
// summary's `thresholds` wins wherever it is available.
export const CRITICAL_SCORE_CEILING = 25;
export const HEALTHY_SCORE_FLOOR = 61;

// A single factor at or above this weight drives the score to 0.
export const CRITICAL_FACTOR_POINTS = 100;

export const BAND_LABEL: Record<HealthBand, string> = {
  critical: "Critical",
  warning: "Needs attention",
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

export const BAND_CRITICALITY: Record<
  HealthBand,
  "error" | "warning" | "success"
> = {
  critical: "error",
  warning: "warning",
  healthy: "success",
};
