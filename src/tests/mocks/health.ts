// LA061 — fixture data for the Health endpoints. Switch between shapes at
// runtime via `setHealthFixture('crisisFleet')` etc. from the dev console.

export type Band = "critical" | "warning" | "healthy";

export interface HealthFactor {
  rule_id: number;
  rule_key: string;
  description: string;
  points: number;
}

export interface ComputerHealth {
  computer_id: number;
  account_id: number;
  score: number;
  band: Band;
  critical_factor_count: number;
  factors: HealthFactor[];
  updated_at: string | null;
}

export interface FleetHealthSummary {
  account_id: number;
  band_critical_count: number;
  band_warning_count: number;
  band_healthy_count: number;
  total_count: number;
  updated_at: string | null;
}

export interface HealthRule {
  id: number;
  account_id: number | null;
  rule_key: string;
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
const WARNING_SCORE_MID = 50;
const WARNING_SCORE_LOW = 40;
const CRITICAL_SCORE = 0;

// Fleet shape sizes.
const FLEET_SIZE = 100;
const HEALTHY_FLEET_WARNINGS = 3;
const MIXED_FLEET_CRITICAL = 10;
const MIXED_FLEET_WARNING = 40;
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

// ─── fleet fixtures ─────────────────────────────────────────────────────

export const healthyFleet = {
  summary: {
    account_id: 1,
    band_critical_count: 0,
    band_warning_count: HEALTHY_FLEET_WARNINGS,
    band_healthy_count: FLEET_SIZE - HEALTHY_FLEET_WARNINGS,
    total_count: FLEET_SIZE,
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
  summary: {
    account_id: 1,
    band_critical_count: MIXED_FLEET_CRITICAL,
    band_warning_count: MIXED_FLEET_WARNING - MIXED_FLEET_CRITICAL,
    band_healthy_count: FLEET_SIZE - MIXED_FLEET_WARNING,
    total_count: FLEET_SIZE,
    updated_at: NOW,
  } as FleetHealthSummary,
  computers: Array.from({ length: FLEET_SIZE }, (_, i) => {
    if (i < MIXED_FLEET_CRITICAL) {
      return makeComputerHealth(i + 1, CRITICAL_SCORE, [factorCritical], 1);
    }
    if (i < MIXED_FLEET_WARNING) {
      return makeComputerHealth(i + 1, WARNING_SCORE_MID, [
        factorHigh,
        factorReboot,
      ]);
    }
    return makeComputerHealth(i + 1, HEALTHY_SCORE);
  }),
};

export const crisisFleet = {
  summary: {
    account_id: 1,
    band_critical_count: CRISIS_FLEET_CRITICAL,
    band_warning_count: CRISIS_FLEET_WARNING - CRISIS_FLEET_CRITICAL,
    band_healthy_count: FLEET_SIZE - CRISIS_FLEET_WARNING,
    total_count: FLEET_SIZE,
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
    updated_at: null,
  } as FleetHealthSummary,
  computers: [] as ComputerHealth[],
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
