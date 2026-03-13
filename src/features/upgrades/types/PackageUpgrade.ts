import type { PriorityOrSeverity } from "./PriorityOrSeverity";

export interface PackageUpgrade extends Record<string, unknown> {
  id: number;
  name: string;
  details: string;
  versions: {
    newest: string;
    current: string;
  };
  affected_instance_count: number;
  os: string;
  usn: string | null;
  cve: string | null;
  priority: PriorityOrSeverity | null;
  severity: PriorityOrSeverity | null;
}
