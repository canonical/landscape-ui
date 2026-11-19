// LA061 types. The shapes follow the instance health engine design documents
// (computer endpoints, fleet and rules endpoints). Anything those documents
// leave to Phase 2 is grouped at the bottom and only exists on mocks.

export type HealthBand = "critical" | "warning" | "healthy";

export type HealthStaleReason = "inputs" | "rules" | "engine";

export interface HealthFactor {
  rule_key: string;
  kind: string;
  title: string;
  // How many items matched the rule.
  count: number;
  points: number;
  // The part of `count` whose fix is installed and waits for a reboot.
  pending_reboot_count?: number;
}

export interface MeasuredComputerHealth {
  computer_id: number;
  measurable: true;
  score: number;
  band: HealthBand;
  critical_factor_count: number;
  factors: HealthFactor[];
  inputs_as_of: string;
  evaluated_at: string;
  rules_version: number;
  engine_version: number;
  stale: boolean;
  stale_reason: HealthStaleReason | null;
  // Phase 2, mocks only. An empty array means "nothing recommended" and must
  // not fall back to `recommendedActionsFor(factors)`.
  recommended_actions?: HealthActionKind[];
}

// A computer with no state row: it cannot be scored or is not scored yet.
export interface UnmeasuredComputerHealth {
  computer_id: number;
  measurable: false;
}

export type ComputerHealth = MeasuredComputerHealth | UnmeasuredComputerHealth;

export interface FleetHealthBands {
  critical: number;
  warning: number;
  healthy: number;
  unmeasured: number;
}

export interface FleetHealthThresholds {
  critical_max: number;
  warning_max: number;
}

// One rule and the instances it currently costs points.
export interface FleetTopIssue {
  rule_key: string;
  title: string;
  computer_count: number;
  points_sum: number;
}

export interface FleetHealthSummary {
  bands: FleetHealthBands;
  measured_count: number;
  // Measured plus unmeasured.
  total_count: number;
  // Null when nothing is measured.
  average_score: number | null;
  thresholds: FleetHealthThresholds;
  // Null until the first recompute after the feature is enabled.
  rules_version: number | null;
  // Every rule with at least one matching instance, most instances first.
  top_issues: FleetTopIssue[];
  updated_at: string | null;
  worker_last_tick_at: string | null;
  // The counters are partial while this is true.
  recompute_in_progress: boolean;
  // Phase 2, mocks only: present when the request passed `group_by`.
  groups?: HealthGroupSummary[];
  // Phase 2, mocks only: kernel USNs the Livepatch waiver is suppressing.
  kernel_usns_waived_count?: number;
}

export interface HealthRule {
  rule_key: string;
  kind: string;
  params: Record<string, unknown>;
  title: string;
  description: string;
  weight: number;
  // Null means no cap.
  cap: number | null;
  enabled: boolean;
  scope: "system" | "account";
  overrides_system_default: boolean;
}

export interface HealthRulesResponse {
  rules_version: number;
  results: HealthRule[];
}

// ─── History ────────────────────────────────────────────────────────────
// Daily rows, ascending. Days the archive step missed are omitted.

// eslint-disable-next-line @typescript-eslint/no-magic-numbers -- the day counts are the type
export type HealthHistoryRange = 30 | 90 | 365;

export interface FleetHealthHistoryRow {
  // UTC date, `YYYY-MM-DD`.
  date: string;
  bands: FleetHealthBands;
  measured_count: number;
  average_score: number;
  rules_version: number;
  engine_version: number;
}

export interface HealthRuleHistoryRow {
  date: string;
  rule_key: string;
  computer_count: number;
  points_sum: number;
  // The effective weight of the rule on that day.
  weight: number;
}

export interface HealthHistoryFactor {
  rule_key: string;
  count: number;
  points: number;
}

// One day on which the result of an instance changed.
export interface ComputerHealthHistoryRow {
  date: string;
  // Null when the instance became unmeasured that day.
  score: number | null;
  band: HealthBand | null;
  critical_factor_count: number;
  rules_version: number;
  factors: HealthHistoryFactor[];
}

export interface ComputerHealthHistory {
  // The newest row before the window, or null when there is none.
  baseline: ComputerHealthHistoryRow | null;
  results: ComputerHealthHistoryRow[];
}

export interface HealthHistoryResponse<T> {
  results: T[];
}

// ─── Phase 2, mocks only ────────────────────────────────────────────────
// The design documents defer remediation actions and the group breakdown.
// The UI keeps them on mocked responses so their design can be reviewed.

// One row of the grouped `/health/summary?group_by=...` breakdown.
export interface HealthGroupSummary extends Record<string, unknown> {
  group: string;
  band_critical_count: number;
  band_warning_count: number;
  band_healthy_count: number;
  total_count: number;
}

export type HealthGroupBy = "tag" | "distribution" | "account";

export type HealthActionKind =
  | "run-security-updates"
  | "reboot"
  | "refresh-facts"
  | "attach-ubuntu-pro"
  | "run-diagnostic-script";

export interface HealthActionResult {
  action: HealthActionKind;
  computer_id: number;
  // Null for `refresh-facts`, which enqueues no activity.
  activity_id: number | null;
  enqueued_at: string;
}

// The bulk action answers 207, so success is per row.
export type HealthBulkActionOutcomeStatus =
  | "enqueued"
  | "forbidden"
  | "conflict"
  | "not_implemented"
  | "unknown_computer"
  | "error";

export interface HealthBulkActionOutcome {
  computer_id: number;
  status: HealthBulkActionOutcomeStatus;
  activity_id?: number | null;
  error_code?: string | null;
  message?: string | null;
}

export interface HealthBulkActionResult {
  action: HealthActionKind;
  enqueued_at: string;
  results: HealthBulkActionOutcome[];
  success_count: number;
  failure_count: number;
}
