import type { AutoinstallFile } from "@/features/autoinstall-files";

export interface EmployeeGroup extends Record<string, unknown> {
  autoinstall_file: AutoinstallFile | null;
  employee_count: number | null;
  group_id: string;
  id: number;
  issuer_id: number;
  name: string;
  priority: number;
}

export interface ConfigurationLimit {
  limit: number;
}
