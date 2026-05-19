// LA061 types — kept in sync with the server-side Pydantic responses.

export type HealthBand = "critical" | "warning" | "healthy";

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
  band: HealthBand;
  critical_factor_count: number;
  factors: HealthFactor[];
  // LA061 Phase 1.7: server-derived list of recommended actions for this
  // computer's current factors. Optional for backwards compatibility — the
  // UI's `recommendedActionsFor(factors)` helper covers the case where the
  // server omits the field. An explicitly empty array means "nothing
  // recommended" and must NOT fall back to the helper.
  recommended_actions?: HealthActionKind[];
  updated_at: string | null;
}

export interface FleetHealthSummary {
  account_id: number;
  band_critical_count: number;
  band_warning_count: number;
  band_healthy_count: number;
  total_count: number;
  // The average score across measurable instances. Optional for backwards
  // compatibility — the field is being added alongside the Overview hero
  // gauge; clients should treat `undefined` as "compute from band counts".
  average_score?: number;
  // Coverage hint: how many of the account's instances actually have a
  // computed health row. Non-Ubuntu / WSL host instances aren't measurable
  // and don't contribute. Optional for backward compatibility.
  measurable_count?: number;
  updated_at: string | null;
}

// Fleet-wide top detractor: a single rule and the count of instances it's
// currently dragging down. Backs the "Top issues now" panel on the Overview.
export interface FleetTopDetractor {
  rule_id: number;
  rule_key: string;
  description: string;
  weight: number;
  computer_count: number;
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

// LA061 Phase 1.7: action kinds the UI can dispatch from the Health tab.
// `reboot`, `run-security-updates`, and `refresh-facts` are fully wired
// server-side. `attach-ubuntu-pro` and `run-diagnostic-script` return 501 —
// the server omits them from `recommended_actions` so they never reach the
// UI's button row in production, but the UI's local fallback can still
// render them in dev when the MSW handler omits the field. Keep this list
// in sync with `canonical/landscape/health/actions.py:HealthActionKind`
// (server) and the MSW handler.
export type HealthActionKind =
  | "run-security-updates"
  | "reboot"
  | "refresh-facts"
  | "attach-ubuntu-pro"
  | "run-diagnostic-script";

export interface HealthActionResult {
  action: HealthActionKind;
  computer_id: number;
  // Null for `refresh-facts` — that action marks the computer dirty
  // server-side and doesn't enqueue an activity. The UI toast hides the
  // "View activity" link in that case.
  activity_id: number | null;
  enqueued_at: string;
}
