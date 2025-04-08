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
