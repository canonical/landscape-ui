import type { Activity } from "@/features/activities";

export type ProfileActions = 
  | "add"
  | "edit"
  | "edit-constraints"
  | "run"
  | "download"
  | "duplicate";

export type ProfileType =
  | "package"
  | "reboot"
  | "removal"
  | "repository"
  | "script"
  | "security"
  | "upgrade"
  | "wsl";

export interface Profile extends Record<string, unknown> {
  access_group: string;
  all_computers: boolean;
  description?: string;
  id: number;
  name?: string;
  tags: string[];
  title: string;
}

interface PackageProfile extends Profile {
  computers: {
    constrained: number[];
    "non-compliant": number[];
    pending: number[];
  };
  constraints: PackageProfileConstraint[];
  creation_time: string;
  modification_time: string;
  version: string;
}

interface RebootProfile extends Profile {
  next_run: string;
  schedule: string;
  deliver_within: number;
  deliver_delay_window: number;
  num_computers: number;
}

interface RemovalProfile extends Profile {
  cascade_to_children: boolean;
  computers: { num_associated_computers: number };
  days_without_exchange: number;
}

interface RepositoryProfile extends Profile {
  apt_sources: number[];
  pending_count: number;
  pockets: RepositoryProfilePocket[];
}

interface ScriptProfile extends Profile {
  activities: {
    last_activity: Activity | null;
  };
  archived: boolean;
  computers: { num_associated_computers: number };
  created_at: string;
  created_by: { name: string; id: number } | null;
  last_edited_at: string;
  script_id: number;
  time_limit: number;
  trigger: Trigger;
  username: string;
}

interface SecurityProfile extends Profile {
  account_id: number;
  benchmark:
    | "disa_stig"
    | "cis_level1_workstation"
    | "cis_level1_server"
    | "cis_level2_workstation"
    | "cis_level2_server";
  creation_time: string;
  last_run_results: {
    passing: number;
    failing: number;
    in_progress: number;
    not_started: number;
    pass_rate: number;
    report_uri: string | null;
    timestamp: string | null;
  };
  mode: "audit" | "audit-fix" | "audit-fix-restart";
  modification_time: string;
  next_run_time: string | null;
  retention_period: number;
  schedule: string;
  status: "active" | "archived" | "over-limit";
  tailoring_file_uri: string | null;
  associated_instances: number;
  restart_deliver_delay_window: number;
  restart_deliver_delay: number;
}

interface UpgradeProfile extends Profile {
  at_minute: `${number}`;
  autoremove: boolean;
  computers: { num_associated_computers: number };
  deliver_delay_window: `${number}`;
  deliver_within: `${number}`;
  every: UpgradeProfileFrequency;
  next_run: string;
  upgrade_type: UpgradeProfileType;
  at_hour?: `${number}`;
  on_days?: UpgradeProfileDay[];
}

interface WslProfile extends Profile {
  computers: {
    constrained: number[];
    "non-compliant": number[];
    pending: number[];
  };
  cloud_init_contents: string | null;
  cloud_init_secret_name: string | null;
  image_name: string;
  image_source: string | null;
  instance_type: string;
  only_landscape_created: boolean;
}
