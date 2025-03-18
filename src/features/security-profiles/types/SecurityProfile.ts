import type { SecurityProfileStatus } from "./SecurityProfileStatus";

export interface SecurityProfile {
  name: string;
  status: SecurityProfileStatus;
  associatedInstances: number;
  lastAuditPassrate: {
    passed: number;
    failed: number;
  };
  allInstances: boolean;
  tags: string[];
  mode: "audit" | "fixAudit" | "restartFixAudit";
  runs: {
    last: string;
    next: string;
  };
  schedule: string;
}
