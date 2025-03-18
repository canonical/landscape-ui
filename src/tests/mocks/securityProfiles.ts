import type { SecurityProfile } from "@/features/security-profiles";

export const securityProfiles: SecurityProfile[] = [
  {
    name: "CIS 2 laptop compliance",
    status: "active",
    associatedInstances: 10000,
    lastAuditPassrate: {
      passed: 10000,
      failed: 0,
    },
    allInstances: false,
    tags: ["tag name 1", "tag name 2", "tag name 3"],
    mode: "audit",
    runs: {
      last: "2024-12-28T12:34:00Z",
      next: "",
    },
    schedule: "Every year in May and September",
  },
  {
    name: "DISA STIG for Ubuntu 20.04 Compliance Assessment",
    status: "active",
    associatedInstances: 1550,
    lastAuditPassrate: {
      passed: 1240,
      failed: 310,
    },
    allInstances: false,
    tags: ["tag name 1", "tag name 2", "tag name 3"],
    mode: "restartFixAudit",
    runs: {
      last: "2024-12-28T12:34:00Z",
      next: "",
    },
    schedule: "Every year in May and September",
  },
  {
    name: "Ubuntu 20.04 Security Hardening Checklist Audit",
    status: "active",
    associatedInstances: 648,
    lastAuditPassrate: {
      passed: 324,
      failed: 324,
    },
    allInstances: false,
    tags: ["tag name 1", "tag name 2", "tag name 3"],
    mode: "restartFixAudit",
    runs: {
      last: "2024-12-28T12:34:00Z",
      next: "",
    },
    schedule: "Every year in May and September",
  },
  {
    name: "Ubuntu 20.04 LTS Security Configuration Compliance",
    status: "active",
    associatedInstances: 500,
    lastAuditPassrate: {
      passed: 350,
      failed: 150,
    },
    allInstances: false,
    tags: ["tag name 1", "tag name 2", "tag name 3"],
    mode: "restartFixAudit",
    runs: {
      last: "2024-12-28T12:34:00Z",
      next: "",
    },
    schedule: "Every year in May and September",
  },
  {
    name: "CIS Ubuntu Linux 20.04 LTS Benchmark Compliance",
    status: "active",
    associatedInstances: 504,
    lastAuditPassrate: {
      passed: 126,
      failed: 126,
    },
    allInstances: false,
    tags: ["tag name 1", "tag name 2", "tag name 3"],
    mode: "restartFixAudit",
    runs: {
      last: "2024-12-28T12:34:00Z",
      next: "",
    },
    schedule: "Every year in May and September",
  },
  {
    name: "CIS Ubuntu Linux 20.04 LTS Benchmark Compliance",
    status: "active",
    associatedInstances: 252,
    lastAuditPassrate: {
      passed: 0,
      failed: 0,
    },
    allInstances: false,
    tags: ["tag name 1", "tag name 2", "tag name 3"],
    mode: "restartFixAudit",
    runs: {
      last: "2024-12-28T12:34:00Z",
      next: "",
    },
    schedule: "Every year in May and September",
  },
  {
    name: "CIS Ubuntu Linux 20.04 LTS Benchmark Compliance",
    status: "archived",
    associatedInstances: 252,
    lastAuditPassrate: {
      passed: 126,
      failed: 126,
    },
    allInstances: false,
    tags: ["tag name 1", "tag name 2", "tag name 3"],
    mode: "restartFixAudit",
    runs: {
      last: "2024-12-28T12:34:00Z",
      next: "",
    },
    schedule: "Every year in May and September",
  },
];
