// LA061 — fixture data for the Health endpoints. Switch between shapes at
// runtime via `setHealthFixture('crisisFleet')` etc. from the dev console.

export type Band = "critical" | "warning" | "healthy";

export interface HealthFactor {
  rule_id: number;
  rule_key: string;
  description: string;
  points: number;
}

// LA061 Phase 1.7: kept aligned with `src/features/health/types`. The MSW
// handler enriches each fixture with a server-derived `recommended_actions`
// list at response time, so the field is optional here.
export type HealthActionKind =
  | "run-security-updates"
  | "reboot"
  | "refresh-facts"
  | "attach-ubuntu-pro"
  | "run-diagnostic-script";

export interface ComputerHealth {
  computer_id: number;
  account_id: number;
  score: number;
  band: Band;
  critical_factor_count: number;
  factors: HealthFactor[];
  recommended_actions?: HealthActionKind[];
  updated_at: string | null;
}

export interface FleetHealthSummaryGroupRow {
  group: string;
  band_critical_count: number;
  band_warning_count: number;
  band_healthy_count: number;
  total_count: number;
}

export interface FleetHealthSummary {
  account_id: number;
  band_critical_count: number;
  band_warning_count: number;
  band_healthy_count: number;
  total_count: number;
  average_score?: number;
  measurable_count?: number;
  // LA061 Phase 1.8: count of `computer` rows the engine can't score
  // (Windows / WSL host / no distribution). Sum with `measurable_count`
  // equals the account's full instance count.
  unmeasurable_count?: number;
  // LA061 Phase 1.8 fields. Optional so existing fixtures don't need to
  // populate them.
  groups?: FleetHealthSummaryGroupRow[];
  kernel_usns_waived_count?: number;
  updated_at: string | null;
}

export interface FleetTopDetractor {
  rule_id: number;
  rule_key: string;
  title: string;
  description: string;
  weight: number;
  computer_count: number;
}

export interface HealthRule {
  id: number;
  account_id: number | null;
  rule_key: string;
  title: string;
  description: string;
  definition: Record<string, unknown>;
  weight: number;
  enabled: boolean;
  created_at: string;
  updated_at: string;
  is_system_default: boolean;
}

const NOW = "2026-05-12T12:00:00Z";

// Band thresholds — must match the server-side defaults in
// `canonical/landscape/health/bands.py`.
const CRITICAL_MAX = 25;
const WARNING_MAX = 60;

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

// ─── seeded system-default rules (Phase 1.5: seven rows) ────────────────
// Kept in sync with `canonical.landscape.health.seed.SEEDED_RULES`. Phase 1.5
// added `usn.low` and `package.updates_available` (both weight 1) for
// legacy-PackageUpgradesAlert parity.
export const seededRules: HealthRule[] = [
  {
    id: 1,
    account_id: null,
    rule_key: "usn.critical",
    title: "Critical security notice",
    description: "Pending USN with Ubuntu Priority `critical`.",
    definition: { params: { ubuntu_priority: "critical" } },
    weight: 100,
    enabled: true,
    created_at: NOW,
    updated_at: NOW,
    is_system_default: true,
  },
  {
    id: 2,
    account_id: null,
    rule_key: "usn.high",
    title: "High-severity security notice",
    description: "Pending USN with Ubuntu Priority `high`.",
    definition: { params: { ubuntu_priority: "high" } },
    weight: 20,
    enabled: true,
    created_at: NOW,
    updated_at: NOW,
    is_system_default: true,
  },
  {
    id: 3,
    account_id: null,
    rule_key: "usn.medium",
    title: "Medium-severity security notice",
    description: "Pending USN with Ubuntu Priority `medium`.",
    definition: { params: { ubuntu_priority: "medium" } },
    weight: 5,
    enabled: true,
    created_at: NOW,
    updated_at: NOW,
    is_system_default: true,
  },
  {
    id: 4,
    account_id: null,
    rule_key: "usn.low",
    title: "Low-severity security notice",
    description: "Pending USN with Ubuntu Priority `low`.",
    definition: { params: { ubuntu_priority: "low" } },
    weight: 1,
    enabled: true,
    created_at: NOW,
    updated_at: NOW,
    is_system_default: true,
  },
  {
    id: 5,
    account_id: null,
    rule_key: "reboot_required",
    title: "Reboot required",
    description: "ComputerStatus.reboot_required_flag is true.",
    definition: { params: {} },
    weight: 10,
    enabled: true,
    created_at: NOW,
    updated_at: NOW,
    is_system_default: true,
  },
  {
    id: 6,
    account_id: null,
    rule_key: "instance.offline",
    title: "Instance offline",
    description: "Has not exchanged with the server within the last 24 hours.",
    definition: { params: { threshold_hours: 24 } },
    weight: 20,
    enabled: true,
    created_at: NOW,
    updated_at: NOW,
    is_system_default: true,
  },
  {
    id: 7,
    account_id: null,
    rule_key: "package.updates_available",
    title: "Package updates pending",
    description:
      "One or more non-security package updates are pending on the computer.",
    definition: { params: {} },
    weight: 1,
    enabled: true,
    created_at: NOW,
    updated_at: NOW,
    is_system_default: true,
  },
];

// Lookup so synthetic top-detractor rows (built from the factor list) can
// pick up the canonical title from the seeded rule of the same rule_key.
const TITLE_BY_RULE_KEY: Record<string, string> = Object.fromEntries(
  seededRules.map((r) => [r.rule_key, r.title]),
);

function classify(score: number): Band {
  if (score <= CRITICAL_MAX) return "critical";
  if (score <= WARNING_MAX) return "warning";
  return "healthy";
}

function makeComputerHealth(
  computer_id: number,
  score: number,
  factors: HealthFactor[] = [],
  critical_factor_count = 0,
): ComputerHealth {
  return {
    computer_id,
    account_id: 1,
    score,
    band: classify(score),
    critical_factor_count,
    factors,
    updated_at: NOW,
  };
}

const factorCritical: HealthFactor = {
  rule_id: 1,
  rule_key: "usn.critical",
  description: "Pending USN with Ubuntu Priority `critical`.",
  points: 100,
};
const factorHigh: HealthFactor = {
  rule_id: 2,
  rule_key: "usn.high",
  description: "Pending USN with Ubuntu Priority `high`.",
  points: 20,
};
const factorMedium: HealthFactor = {
  rule_id: 3,
  rule_key: "usn.medium",
  description: "Pending USN with Ubuntu Priority `medium`.",
  points: 5,
};
const factorLow: HealthFactor = {
  rule_id: 4,
  rule_key: "usn.low",
  description: "Pending USN with Ubuntu Priority `low`.",
  points: 1,
};
const factorReboot: HealthFactor = {
  rule_id: 5,
  rule_key: "reboot_required",
  description: "Reboot required.",
  points: 10,
};
const factorOffline: HealthFactor = {
  rule_id: 6,
  rule_key: "instance.offline",
  description: "Offline > 24h.",
  points: 20,
};
const factorUpdates: HealthFactor = {
  rule_id: 7,
  rule_key: "package.updates_available",
  description: "Non-security updates pending.",
  points: 1,
};

// ─── fleet helpers ──────────────────────────────────────────────────────

// Walks the computer list to recompute summary fields. Used so fixtures
// can be written by listing each computer's state and we derive the bands
// + average automatically — keeps fixtures internally consistent.
function summarise(computers: ComputerHealth[]): FleetHealthSummary {
  let critical = 0;
  let warning = 0;
  let healthy = 0;
  let total = 0;
  for (const c of computers) {
    total += c.score;
    if (c.band === "critical") critical++;
    else if (c.band === "warning") warning++;
    else healthy++;
  }
  return {
    account_id: 1,
    band_critical_count: critical,
    band_warning_count: warning,
    band_healthy_count: healthy,
    total_count: computers.length,
    average_score: computers.length
      ? Math.round(total / computers.length)
      : 0,
    measurable_count: computers.length,
    // LA061 Phase 1.8: each demo fleet has a couple of synthetic Windows /
    // WSL host instances that the engine can't score. The Overview surfaces
    // them as an "Unmeasured" 4th row so the gauge's denominator stays
    // honest. Default to a small handful so the row actually renders.
    unmeasurable_count: 3,
    updated_at: NOW,
  };
}

// ─── fleet fixtures ─────────────────────────────────────────────────────
//
// IDs 1–100 cover the `instances` mock's IDs (1, 2, 3, 4, 5, 7, 8, 9, 10,
// 11, 12, 20, 21, 33, 65) plus the 200-range. We deliberately spread
// factor *kinds* across the population so the Overview's top-detractor
// panel and the per-row popovers exercise every seeded rule.

/* eslint-disable @typescript-eslint/no-magic-numbers --
 * Fixture data is intentionally explicit: each (id, score) pair is a
 * specific demo case for the Overview hero, side panel, and Health tab.
 * Naming every literal would only obscure intent.
 */

// Per-row demo cases. Each tuple is [id, score, factors, critical_count?]
// and is wired against the `instances` fixture in `mocks/instance.ts` so
// the visible rows show distinct scores, bands, and breakdowns.
const MIXED_SEEDS: readonly [
  number,
  number,
  HealthFactor[],
  number?,
][] = [
  // Ubuntu instances — full spectrum of band-and-factor combinations.
  [1, 0, [factorCritical, factorReboot, factorUpdates], 1],
  [2, 43, [factorHigh, factorOffline, factorMedium, factorUpdates]],
  [3, 88, [factorReboot, factorLow]],
  [4, 78, [factorHigh, factorUpdates]],
  [5, 12, [factorCritical, factorHigh, factorOffline], 1],
  [7, 58, [factorHigh, factorOffline, factorMedium]],
  [8, 32, [factorHigh, factorReboot, factorOffline, factorMedium]],
  [9, 97, [factorLow, factorUpdates]],
  [10, 100, []],
  [11, 64, [factorHigh, factorMedium, factorUpdates]],
  [12, 71, [factorReboot, factorMedium, factorLow]],
  [20, 18, [factorCritical, factorOffline], 1],
  [21, 52, [factorHigh, factorReboot, factorMedium]],
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
  [210, 28, [factorHigh, factorReboot, factorOffline, factorMedium, factorUpdates]],
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

const buildMixedComputers = (): ComputerHealth[] => {
  const out: ComputerHealth[] = [];
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

export const healthyFleet = {
  summary: {
    account_id: 1,
    band_critical_count: 0,
    band_warning_count: HEALTHY_FLEET_WARNINGS,
    band_healthy_count: FLEET_SIZE - HEALTHY_FLEET_WARNINGS,
    total_count: FLEET_SIZE,
    average_score: 96,
    measurable_count: FLEET_SIZE,
    updated_at: NOW,
  } as FleetHealthSummary,
  computers: Array.from({ length: FLEET_SIZE }, (_, i) => {
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
  }),
};

export const mixedFleet = {
  summary: summarise(mixedComputers),
  computers: mixedComputers,
};

export const crisisFleet = {
  summary: {
    account_id: 1,
    band_critical_count: CRISIS_FLEET_CRITICAL,
    band_warning_count: CRISIS_FLEET_WARNING - CRISIS_FLEET_CRITICAL,
    band_healthy_count: FLEET_SIZE - CRISIS_FLEET_WARNING,
    total_count: FLEET_SIZE,
    average_score: 15,
    measurable_count: FLEET_SIZE,
    updated_at: NOW,
  } as FleetHealthSummary,
  computers: Array.from({ length: FLEET_SIZE }, (_, i) => {
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
  }),
};

export const emptyFleet = {
  summary: {
    account_id: 1,
    band_critical_count: 0,
    band_warning_count: 0,
    band_healthy_count: 0,
    total_count: 0,
    average_score: 0,
    measurable_count: 0,
    updated_at: null,
  } as FleetHealthSummary,
  computers: [] as ComputerHealth[],
};

// ─── top-detractor derivation ──────────────────────────────────────────
//
// Walks the active fixture's computer list and counts how many computers
// are affected by each rule key. Returns the top N rules by count,
// breaking ties by weight (heavier rules float to the top). The shape
// mirrors `FleetTopDetractor` and feeds the Overview "Top issues" panel.

export const getFleetTopDetractors = (
  computers: ComputerHealth[],
  limit = 3,
): FleetTopDetractor[] => {
  const byKey = new Map<
    string,
    { factor: HealthFactor; count: number; weight: number }
  >();
  for (const computer of computers) {
    for (const factor of computer.factors) {
      const existing = byKey.get(factor.rule_key);
      if (existing) {
        existing.count += 1;
      } else {
        byKey.set(factor.rule_key, {
          factor,
          count: 1,
          weight: factor.points,
        });
      }
    }
  }
  return Array.from(byKey.values())
    .sort((a, b) => b.count - a.count || b.weight - a.weight)
    .slice(0, limit)
    .map(({ factor, count, weight }) => ({
      rule_id: factor.rule_id,
      rule_key: factor.rule_key,
      title: TITLE_BY_RULE_KEY[factor.rule_key] ?? "",
      description: factor.description,
      weight,
      computer_count: count,
    }));
};

// ─── per-computer detail (exercised by the Health Bar's expanded view) ──
// Many-factor case: a single computer with every Phase 1.5 seeded rule
// matching. Exercises the FactorBreakdown table at its widest.
export const manyFactorsComputer: ComputerHealth = {
  computer_id: 9999,
  account_id: 1,
  score: 0,
  band: "critical",
  critical_factor_count: 1,
  factors: [
    factorCritical,
    factorHigh,
    factorMedium,
    factorLow,
    factorReboot,
    factorOffline,
    factorUpdates,
  ],
  updated_at: NOW,
};

// ─── Livepatch-waiver demo fleet ────────────────────────────────────────
// Two computers with the same vulnerable kernel package: one has Livepatch
// active and gets the critical USN penalty waived; the other does not and
// drops to score 0. Mirrors the spec § "Livepatch waiver" case-4 scenario.
const factorOnlyReboot = factorReboot;

const LIVEPATCH_PRO_ID = 1001;
const LIVEPATCH_NON_PRO_ID = 1002;
// Score for the Pro instance: 100 - reboot_required(10) = 90. Healthy band.
const LIVEPATCH_PRO_SCORE = HEALTHY_SCORE - 10;

export const livepatchWaiverFleet = {
  summary: {
    account_id: 1,
    band_critical_count: 1,
    band_warning_count: 0,
    band_healthy_count: 1,
    total_count: 2,
    updated_at: NOW,
  } as FleetHealthSummary,
  computers: [
    // Pro / Livepatched: kernel USN waived, only the reboot factor remains.
    {
      ...makeComputerHealth(LIVEPATCH_PRO_ID, LIVEPATCH_PRO_SCORE, [
        factorOnlyReboot,
      ]),
    },
    // No Livepatch: full critical USN penalty applies.
    {
      ...makeComputerHealth(
        LIVEPATCH_NON_PRO_ID,
        CRITICAL_SCORE,
        [factorCritical, factorOnlyReboot],
        1,
      ),
    },
  ],
};

// ─── runtime fixture switcher ──────────────────────────────────────────

export const fixtures = {
  healthyFleet,
  mixedFleet,
  crisisFleet,
  emptyFleet,
  livepatchWaiverFleet,
} as const;

export type FixtureName = keyof typeof fixtures;

let activeFixture: FixtureName = "mixedFleet";

export const getHealthFixture = () => fixtures[activeFixture];

export const setHealthFixture = (name: FixtureName) => {
  activeFixture = name;
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
