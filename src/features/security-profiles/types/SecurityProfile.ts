import type { SecurityProfileStatus } from "./SecurityProfileStatus";

export interface SecurityProfile extends Record<string, unknown> {
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

/*
export interface SecurityProfile extends Record<string, unknown> {
  acess_group: string;
  acount_id: number;
  all_computers: boolean;
  benchmark: string;
  creation_time: string;
  id: number;
  associatedInstances: number;
  lastAuditPassrate: {
    passed: number;
    failed: number;
  };
  allInstances: boolean;
  mode: "audit" | "fixAudit" | "restartFixAudit";
  modification_time: string;
  name: string;
  next_run_time: string;
  schedule: string;
  status: SecurityProfileStatus;
  tags: string[];
  tailoring_file_uri: string;
  title: string;
}
*/
