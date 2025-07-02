export const SECURITY_PROFILE_ASSOCIATED_INSTANCES_LIMIT = 5000;
export const ACTIVE_SECURITY_PROFILES_LIMIT = 5;

export const SECURITY_PROFILE_BENCHMARK_LABELS = {
  cis_level1_workstation: "CIS Level 1 Workstation",
  cis_level1_server: "CIS Level 1 Server",
  cis_level2_workstation: "CIS Level 2 Workstation",
  cis_level2_server: "CIS Level 2 Server",
  disa_stig: "DISA-STIG",
};

export const SECURITY_PROFILE_MODE_LABELS = {
  audit: "Audit only",
  "audit-fix": "Fix and audit",
  "audit-fix-restart": "Fix, restart, audit",
};
