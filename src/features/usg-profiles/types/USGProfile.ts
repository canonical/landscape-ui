import type { Profile } from "@/features/profiles";

export type SecurityBenchmark =
  | "disa_stig"
  | "cis_level1_workstation"
  | "cis_level1_server"
  | "cis_level2_workstation"
  | "cis_level2_server";

export type USGProfileStatus = "active" | "archived" | "over-limit";

export type USGProfileMode = "audit" | "audit-fix" | "audit-fix-restart";

export interface LastRunResults {
  passing: number;
  failing: number;
  in_progress: number;
  not_started: number;
  pass_rate: number;
  report_uri: string | null;
  timestamp: string | null;
}

export interface USGProfile extends Profile {
  account_id: number;
  benchmark: SecurityBenchmark;
  creation_time: string;
  last_run_results: LastRunResults;
  mode: USGProfileMode;
  modification_time: string;
  next_run_time: string | null;
  retention_period: number;
  schedule: string;
  status: USGProfileStatus;
  tailoring_file_uri: string | null;
  associated_instances: number;
  restart_deliver_delay_window: number;
  restart_deliver_delay: number;
}
