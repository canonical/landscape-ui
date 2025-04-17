import type { Creator } from "@/types/Creator";
import type { AccessGroup } from "./accessGroup";
import type { ScriptStatus } from "./ScriptStatus";

export interface Script extends Record<string, unknown> {
  id: number;
  access_group: AccessGroup["name"];
  creator: Creator;
  title: string;
  time_limit: number;
  username: string;
  attachments: string[];
  status: ScriptStatus;
}

export interface SingleScript extends Script {
  version_number: number;
  created_by: string;
  created_at: string;
  last_edited_by: string;
  last_edited_at: string;
  script_profiles: { id: number; title: string }[];
  code: string;
  interpreter: string;
}

export interface ScriptVersion extends Record<string, unknown> {
  id: number;
  account_id: number;
  script_id: number;
  creator_name: string;
  creator_id: number;
  created_at: string;
  version_number: number;
  code: string;
  interpreter: string;
  title: string;
}
