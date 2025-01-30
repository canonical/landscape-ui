import type { Creator } from "./Creator";
import type { AccessGroup } from "./accessGroup";

export interface Script extends Record<string, unknown> {
  access_group: AccessGroup["name"];
  attachments: string[];
  creator: Creator;
  id: number;
  interpreter?: string;
  time_limit: number;
  title: string;
  username: string;
}
