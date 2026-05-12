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
