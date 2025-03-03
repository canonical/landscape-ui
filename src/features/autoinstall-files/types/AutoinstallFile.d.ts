import type { EmployeeGroup } from "./EmployeeGroup";

export interface AutoinstallFile extends Record<string, unknown> {
  contents: string;
  created_at: string;
  filename: string;
  id: number;
  is_default: boolean;
  last_modified_at: string;
  version: number;
}

export interface AutoinstallFileWithGroups extends AutoinstallFile {
  groups: EmployeeGroup[];
}
