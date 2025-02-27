import type { AutoinstallFileEvent } from "./AutoinstallFileEvent";

export interface AutoinstallFile extends Record<string, unknown> {
  filename: string;
  is_default: boolean;
  employeeGroupsAssociated: string[];
  lastModified: string;
  dateCreated: string;
  version: number;
  events: AutoinstallFileEvent[];
}
