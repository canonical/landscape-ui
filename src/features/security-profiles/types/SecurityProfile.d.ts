export interface SecurityProfile extends Record<string, unknown> {
  access_group: string;
  account_id: number;
  all_computers: boolean;
  benchmark:
    | "disa_stig"
    | "cis_level1_workstation"
    | "cis_level1_server"
    | "cis_level2_workstation"
    | "cis_level2_server";
  creation_time: string;
  id: number;
  last_run_results: {
    passing: number;
    failing: number;
    in_progress: number;
    report_uri: string | null;
    timestamp: string;
  };
  mode: "audit" | "fix-audit" | "fix-restart-audit";
  modification_time: string;
  name: string;
  next_run_time: string;
  retention_period: number;
  schedule: string;
  status: "active" | "archived";
  tags: string[];
  tailoring_file_uri: string | null;
  title: string;
  associated_instances: number;
  restart_deliver_delay_window: number;
  restart_deliver_delay: number;
}
