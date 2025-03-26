import type { SecurityProfileStatus } from "./SecurityProfileStatus";

interface SecurityProfileBase {
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
  tailoringFile: File | null;
  benchmark: string;
  accessGroup: string;
}

interface SecurityProfileWithRestart extends SecurityProfileBase {
  mode: "restartFixAudit";
  restartSchedule: string;
}

interface SecurityProfileWithoutRestart extends SecurityProfileBase {
  mode: "audit" | "fixAudit";
}

export type SecurityProfile =
  | SecurityProfileWithRestart
  | SecurityProfileWithoutRestart;
