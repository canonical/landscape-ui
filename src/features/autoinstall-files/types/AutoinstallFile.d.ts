import type { EmployeeGroup } from "@/features/employee-groups";

export interface AutoinstallFile extends Record<string, unknown> {
  contents: string;
  created_at: string;
  filename: string;
  id: number;
  is_default: boolean;
  last_modified_at: string;
  version: number;
}

export interface WithGroups<T extends AutoinstallFile> extends T {
  groups: EmployeeGroup[];
}

export interface AutoinstallFileVersionInfo extends Record<string, unknown> {
  version: number;
  created_at: string;
}

export interface WithVersions<T extends AutoinstallFile> extends T {
  versions: AutoinstallFileVersionInfo[];
}
