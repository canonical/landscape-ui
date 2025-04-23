import type { AccessGroup } from "./accessGroup";
import type { ScriptStatus } from "./ScriptStatus";

interface Creator {
  id: number;
  name: string;
}

export interface TruncatedScriptProfile extends Record<string, unknown> {
  id: number;
  title: string;
}

interface Attachment {
  id: number;
  filename: string;
}

export interface Script extends Record<string, unknown> {
  id: number;
  access_group: AccessGroup["name"];
  created_by: Creator;
  title: string;
  time_limit: number;
  username: string;
  attachments: Attachment[];
  status: ScriptStatus;
  created_at: string;
  last_edited_by: Creator;
  last_edited_at: string;
  script_profiles: TruncatedScriptProfile[];
  code: string;
  interpreter: string;
  is_redactable: boolean;
  is_editable: boolean;
  is_executable: boolean;
}

export interface SingleScript extends Script {
  version_number: number;
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

export interface TruncatedScriptVersion extends Record<string, unknown> {
  id: number;
  version_number: number;
  created_at: string;
  created_by: {
    name: string;
    id: number;
  };
  code: string;
  interpreter: string;
  title: string;
}
