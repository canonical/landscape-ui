// LA061 — fixture data for the Health endpoints. Switch between shapes at
// runtime via `setHealthFixture('crisisFleet')` etc. from the dev console.
// Shapes follow the instance health engine design documents.

import type {
  ComputerHealth,
  FleetHealthSummary,
  FleetTopIssue,
  HealthActionKind,
  HealthBand,
  HealthFactor,
  HealthRule,
  MeasuredComputerHealth,
} from "@/features/health";
import { instances } from "./instance";

export type {
  ComputerHealth,
  FleetHealthSummary,
  FleetTopIssue,
  HealthActionKind,
  HealthFactor,
  HealthRule,
  MeasuredComputerHealth,
};

const NOW = "2026-05-12T12:00:00Z";

export const RULES_VERSION = 7;
const ENGINE_VERSION = 1;

// Band thresholds, returned by the summary so clients never hard-code them.
const CRITICAL_MAX = 25;
const WARNING_MAX = 60;
export const thresholds = {
  critical_max: CRITICAL_MAX,
  warning_max: WARNING_MAX,
};

// Score bands used in fixture shapes.
const HEALTHY_SCORE = 100;
const WARNING_SCORE_HIGH = 70;
const WARNING_SCORE_LOW = 40;
const CRITICAL_SCORE = 0;

// Fleet shape sizes.
const FLEET_SIZE = 100;
const HEALTHY_FLEET_WARNINGS = 3;
const CRISIS_FLEET_CRITICAL = 80;
const CRISIS_FLEET_WARNING = 95;
// Instances the engine has no score for, shown as the "Unmeasured" row.
const DEFAULT_UNMEASURED = 3;

// ─── seeded system-default rules ────────────────────────────────────────

const usnRule = (
  priority: string | null,
  title: string,
  weight: number,
  cap: number | null,
): HealthRule => ({
  rule_key: `usn.${priority ?? "unrated"}`,
  kind: "usn.severity_band",
  params: { ubuntu_priority: priority },
  title,
  description: priority
    ? `Pending Ubuntu Security Notice with ${priority} severity.`
    : "Pending Ubuntu Security Notice with no severity assigned yet.",
  weight,
  cap,
  enabled: true,
  scope: "system",
  overrides_system_default: false,
});

/* eslint-disable @typescript-eslint/no-magic-numbers --
 * Weights and caps of the seeded rules, as the data model document lists them.
 */
export const seededRules: HealthRule[] = [
  usnRule("critical", "Critical-severity security notice", 100, null),
  usnRule("high", "High-severity security notice", 20, 60),
  usnRule("medium", "Medium-severity security notice", 5, 40),
  usnRule("low", "Low-severity security notice", 1, 15),
  usnRule(null, "Unrated security notice", 5, 20),
  {
    rule_key: "reboot_required",
    kind: "reboot_required",
    params: {},
    title: "Reboot required",
    description: "The instance is waiting for a reboot.",
    weight: 10,
    cap: null,
    enabled: true,
    scope: "system",
    overrides_system_default: false,
  },
  {
    rule_key: "instance.offline",
    kind: "instance.offline",
    params: { threshold_hours: 24 },
    title: "Instance offline",
    description: "Has not exchanged with the server within the last 24 hours.",
    weight: 20,
    cap: null,
    enabled: true,
    scope: "system",
    overrides_system_default: false,
  },
  {
    rule_key: "package.updates_available",
    kind: "package.updates_available",
    params: {},
    title: "Package updates available",
    description: "Package updates that are not security fixes are pending.",
    weight: 1,
    cap: 20,
    enabled: true,
    scope: "system",
    overrides_system_default: false,
  },
];
/* eslint-enable @typescript-eslint/no-magic-numbers */

function classify(score: number): HealthBand {
  if (score <= CRITICAL_MAX) return "critical";
  if (score <= WARNING_MAX) return "warning";
  return "healthy";
}

function makeComputerHealth(
  computer_id: number,
  score: number,
  factors: HealthFactor[] = [],
  critical_factor_count = 0,
): MeasuredComputerHealth {
  return {
    computer_id,
    measurable: true,
    score,
    band: classify(score),
    critical_factor_count,
    factors,
    inputs_as_of: NOW,
    evaluated_at: NOW,
    rules_version: RULES_VERSION,
    engine_version: ENGINE_VERSION,
    stale: false,
    stale_reason: null,
  };
}

// One match of a seeded rule.
const factorFor = (rule_key: string): HealthFactor => {
  const rule = seededRules.find((r) => r.rule_key === rule_key);
  if (!rule) {
    throw new Error(`Unknown seeded rule ${rule_key}`);
  }
  return {
    rule_key,
    kind: rule.kind,
    title: rule.title,
    count: 1,
    points: rule.weight,
  };
};

const factorCritical = factorFor("usn.critical");
const factorHigh = factorFor("usn.high");
// The fix is installed and takes effect after a reboot.
const factorHighPendingReboot: HealthFactor = {
  ...factorHigh,
  pending_reboot_count: 1,
};
const factorMedium = factorFor("usn.medium");
const factorLow = factorFor("usn.low");
const factorUnrated = factorFor("usn.unrated");
const factorReboot = factorFor("reboot_required");
const factorOffline = factorFor("instance.offline");
const factorUpdates = factorFor("package.updates_available");

// ─── fleet helpers ──────────────────────────────────────────────────────

// Per-rule breakdown as the summary returns it: most instances first, then
// by rule key. Rules with no matching computer are omitted.
export const getTopIssues = (
  computers: MeasuredComputerHealth[],
): FleetTopIssue[] => {
  const byKey = new Map<string, FleetTopIssue>();
  for (const computer of computers) {
    for (const factor of computer.factors) {
      const issue = byKey.get(factor.rule_key) ?? {
        rule_key: factor.rule_key,
        title: factor.title,
        computer_count: 0,
        points_sum: 0,
      };
      issue.computer_count += 1;
      issue.points_sum += factor.points;
      byKey.set(factor.rule_key, issue);
    }
  }
  return Array.from(byKey.values()).sort(
    (a, b) =>
      b.computer_count - a.computer_count ||
      a.rule_key.localeCompare(b.rule_key),
  );
};

// Derives the summary from the computer list so a fixture stays consistent
// with itself.
function summarise(
  computers: MeasuredComputerHealth[],
  unmeasured = DEFAULT_UNMEASURED,
): FleetHealthSummary {
  const bands = { critical: 0, warning: 0, healthy: 0, unmeasured };
  let scoreSum = 0;
  for (const c of computers) {
    scoreSum += c.score;
    bands[c.band] += 1;
  }
  const measured = computers.length;
  return {
    bands,
    measured_count: measured,
    total_count: measured + unmeasured,
    average_score: measured ? Math.round(scoreSum / measured) : null,
    thresholds,
    rules_version: RULES_VERSION,
    top_issues: getTopIssues(computers),
    updated_at: measured ? NOW : null,
    worker_last_tick_at: NOW,
    recompute_in_progress: false,
  };
}

// ─── fleet fixtures ─────────────────────────────────────────────────────
//
// IDs 1–100 cover the `instances` mock's IDs (1, 2, 3, 4, 5, 7, 8, 9, 10,
// 11, 12, 20, 21, 33, 65) plus the 200-range. We deliberately spread
// factor *kinds* across the population so the Overview's top issues
// panel and the per-row popovers exercise every seeded rule.

/* eslint-disable @typescript-eslint/no-magic-numbers --
 * Fixture data is intentionally explicit: each (id, score) pair is a
 * specific demo case for the Overview hero, side panel, and Health tab.
 * Naming every literal would only obscure intent.
 */

// Per-row demo cases. Each tuple is [id, score, factors, critical_count?]
// and is wired against the `instances` fixture in `mocks/instance.ts` so
// the visible rows show distinct scores, bands, and breakdowns.
const MIXED_SEEDS: readonly [number, number, HealthFactor[], number?][] = [
  // Ubuntu instances — full spectrum of band-and-factor combinations.
  [1, 0, [factorCritical, factorReboot, factorUpdates], 1],
  [2, 43, [factorHigh, factorOffline, factorMedium, factorUpdates]],
  [3, 88, [factorReboot, factorLow]],
  [4, 78, [factorHigh, factorUnrated]],
  [5, 12, [factorCritical, factorHigh, factorOffline], 1],
  [7, 58, [factorHigh, factorOffline, factorMedium]],
  [8, 32, [factorHigh, factorReboot, factorOffline, factorMedium]],
  [9, 97, [factorLow, factorUpdates]],
  [10, 100, []],
  [11, 64, [factorHigh, factorMedium, factorUpdates]],
  [12, 71, [factorReboot, factorMedium, factorUnrated]],
  [20, 18, [factorCritical, factorOffline], 1],
  [21, 52, [factorHighPendingReboot, factorReboot, factorOffline]],
  [33, 94, [factorLow, factorMedium]],
  [65, 86, [factorReboot]],

  // 200-range — broader spread, including the worst-instance edge case.
  [200, 76, [factorHigh, factorLow]],
  [201, 100, []],
  [202, 38, [factorHigh, factorReboot, factorOffline, factorMedium]],
  [203, 0, [factorCritical, factorReboot, factorOffline, factorHigh], 1],
  [204, 96, [factorLow, factorUpdates]],
  [205, 47, [factorHigh, factorReboot, factorMedium]],
  [206, 91, [factorReboot, factorUpdates]],
  [207, 99, [factorUpdates]],
  [208, 8, [factorCritical, factorHigh, factorOffline, factorReboot], 1],
  [209, 82, [factorMedium, factorReboot]],
  [
    210,
    28,
    [factorHigh, factorReboot, factorOffline, factorMedium, factorUpdates],
  ],
];

// Filler-tail buckets so the wider fleet summary stays believable.
// Cycles through six archetypes by ID modulo to avoid a uniform tail.
const FILLER_ARCHETYPES: readonly [number, HealthFactor[], number?][] = [
  [100, [], 0], // 0 — clean
  [88, [factorReboot], 0], // 1 — reboot pending
  [73, [factorHigh, factorReboot], 0], // 2 — high USN
  [55, [factorHigh, factorMedium, factorOffline], 0], // 3 — warning
  [22, [factorHigh, factorReboot, factorOffline, factorMedium], 0], // 4 — bad warning
  [0, [factorCritical], 1], // 5 — critical
];

const buildMixedComputers = (): MeasuredComputerHealth[] => {
  const out: MeasuredComputerHealth[] = [];
  for (const seed of MIXED_SEEDS) {
    const [id, score, factors, critical] = seed;
    out.push(makeComputerHealth(id, score, factors, critical ?? 0));
  }

  // Fill the rest of the synthetic fleet with rotating archetypes so the
  // fleet summary's average score is plausible and operators can scroll
  // through and see different bands rather than 100s only.
  const usedIds = new Set(out.map((c) => c.computer_id));
  for (let id = 1; id <= FLEET_SIZE; id++) {
    if (usedIds.has(id)) continue;
    const seed = FILLER_ARCHETYPES[id % FILLER_ARCHETYPES.length];
    if (!seed) continue;
    const [score, factors, critical] = seed;
    out.push(makeComputerHealth(id, score, factors, critical ?? 0));
  }
  return out;
};
/* eslint-enable @typescript-eslint/no-magic-numbers */

const mixedComputers = buildMixedComputers();

const healthyComputers = Array.from({ length: FLEET_SIZE }, (_, i) => {
  if (i < HEALTHY_FLEET_WARNINGS) {
    return makeComputerHealth(i + 1, WARNING_SCORE_HIGH, [factorReboot]);
  }
  // Scatter a small `usn.low` + `package.updates_available` tail across
  // the otherwise-healthy population so the visualization gets to render
  // the lowest-severity factors too. Score still in the healthy band.
  if (i < HEALTHY_FLEET_WARNINGS + 5) {
    return makeComputerHealth(i + 1, HEALTHY_SCORE - 2, [
      factorLow,
      factorUpdates,
    ]);
  }
  return makeComputerHealth(i + 1, HEALTHY_SCORE);
});

export const healthyFleet = {
  summary: summarise(healthyComputers, 0),
  computers: healthyComputers,
};

export const mixedFleet = {
  summary: summarise(mixedComputers),
  computers: mixedComputers,
};

const crisisComputers = Array.from({ length: FLEET_SIZE }, (_, i) => {
  if (i < CRISIS_FLEET_CRITICAL) {
    // Exercise the tie-break: alternating between 1 and 2 critical factors.
    const twoCriticals = i % 2 === 1;
    const factors = twoCriticals
      ? [factorCritical, factorOffline]
      : [factorCritical];
    return makeComputerHealth(i + 1, CRITICAL_SCORE, factors, 1);
  }
  if (i < CRISIS_FLEET_WARNING) {
    return makeComputerHealth(i + 1, WARNING_SCORE_LOW, [
      factorHigh,
      factorReboot,
    ]);
  }
  return makeComputerHealth(i + 1, HEALTHY_SCORE);
});

export const crisisFleet = {
  summary: summarise(crisisComputers, 0),
  computers: crisisComputers,
};

export const emptyFleet = {
  summary: summarise([], 0),
  computers: [] as MeasuredComputerHealth[],
};

// The window after the feature is enabled: nothing is scored yet, so every
// computer reads as unmeasured and the counters are zero.
export const recomputingFleet = {
  summary: {
    ...summarise([], FLEET_SIZE),
    rules_version: null,
    worker_last_tick_at: null,
    recompute_in_progress: true,
  } as FleetHealthSummary,
  computers: [] as MeasuredComputerHealth[],
};

// ─── per-computer detail (exercised by the Health Bar's expanded view) ──
// Many-factor case: a single computer with every seeded rule matching.
const MANY_FACTORS_ID = 9999;
export const manyFactorsComputer: MeasuredComputerHealth = makeComputerHealth(
  MANY_FACTORS_ID,
  CRITICAL_SCORE,
  [
    factorCritical,
    factorHigh,
    factorMedium,
    factorLow,
    factorUnrated,
    factorReboot,
    factorOffline,
    factorUpdates,
  ],
  1,
);

// ─── Livepatch-waiver demo fleet ────────────────────────────────────────
// Two computers with the same vulnerable kernel package: one has Livepatch
// active and gets the critical USN penalty waived; the other does not and
// drops to score 0.
const LIVEPATCH_PRO_ID = 1001;
const LIVEPATCH_NON_PRO_ID = 1002;
// Score for the Pro instance: 100 - reboot_required(10) = 90. Healthy band.
const LIVEPATCH_PRO_SCORE = HEALTHY_SCORE - 10;

const livepatchComputers = [
  // Pro / Livepatched: kernel USN waived, only the reboot factor remains.
  makeComputerHealth(LIVEPATCH_PRO_ID, LIVEPATCH_PRO_SCORE, [factorReboot]),
  // No Livepatch: full critical USN penalty applies.
  makeComputerHealth(
    LIVEPATCH_NON_PRO_ID,
    CRITICAL_SCORE,
    [factorCritical, factorReboot],
    1,
  ),
];

export const livepatchWaiverFleet = {
  summary: summarise(livepatchComputers, 0),
  computers: livepatchComputers,
};

// ─── runtime fixture switcher ──────────────────────────────────────────

export const fixtures = {
  healthyFleet,
  mixedFleet,
  crisisFleet,
  emptyFleet,
  recomputingFleet,
  livepatchWaiverFleet,
} as const;

export type FixtureName = keyof typeof fixtures;

let activeFixture: FixtureName = "mixedFleet";

export const getHealthFixture = () => fixtures[activeFixture];

export const setHealthFixture = (name: FixtureName) => {
  activeFixture = name;
};

// The server only scores Ubuntu instances, so a mocked instance of another
// distribution is unmeasured whatever the fixture holds for its id.
const isScoredDistribution = (computerId: number): boolean => {
  const info = instances.find(({ id }) => id === computerId)?.distribution_info;
  if (!info) return true;
  const text = `${info.description ?? ""} ${info.distributor ?? ""}`;
  return /ubuntu|canonical/i.test(text);
};

/** Returns the health state resource for a computer in the active fixture. */
export const getComputerHealth = (computerId: number): ComputerHealth => {
  const found =
    computerId === manyFactorsComputer.computer_id
      ? manyFactorsComputer
      : getHealthFixture().computers.find(
          ({ computer_id }) => computer_id === computerId,
        );
  return found && isScoredDistribution(computerId)
    ? found
    : { computer_id: computerId, measurable: false };
};

// Expose on window in dev for stakeholder demos.
declare global {
  interface Window {
    setHealthFixture?: (name: FixtureName) => void;
  }
}
if (typeof window !== "undefined") {
  window.setHealthFixture = setHealthFixture;
}
