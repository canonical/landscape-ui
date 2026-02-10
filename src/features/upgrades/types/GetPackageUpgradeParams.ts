import type { PriorityOrSeverity } from "./PriorityOrSeverity";

export interface GetPackageUpgradeParams {
  offset?: number;
  limit?: number;
  priorities?: PriorityOrSeverity[];
  severities?: PriorityOrSeverity[];
  search?: string;
  query?: string;
  security_only?: boolean;
}
