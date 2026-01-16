import type { PriorityOrSeverity } from "./PriorityOrSeverity";

export interface GetPackageUpgradeParams {
  offset: number;
  limit: number;
  priorities: PriorityOrSeverity[];
  severities: PriorityOrSeverity[];
  upgrade_type: "all" | "security";
  search: string;
  query: string;
}
