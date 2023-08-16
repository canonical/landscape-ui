import { Creator } from "./Creator";
import { AccessGroup } from "./accessGroup";

export interface Script {
  creator: Creator;
  interpreter: string;
  title: string;
  time_limit: number;
  username: string;
  id: number;
  access_group: AccessGroup;
  attachments: string[];
}
