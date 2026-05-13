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

// Stub action kinds the UI can dispatch from the Health tab. The server-side
// counterpart is a thin shim that enqueues the corresponding existing
// activity (e.g. UbuntuProAttach, ScriptExecution) — full plumbing lands
// with the real remediation work. Keep this list in sync with the MSW
// handler and the Python stub.
export type HealthActionKind =
  | "run-security-updates"
  | "reboot"
  | "refresh-facts"
  | "attach-ubuntu-pro"
  | "run-diagnostic-script";

export interface HealthActionResult {
  action: HealthActionKind;
  computer_id: number;
  activity_id: number;
  enqueued_at: string;
}
