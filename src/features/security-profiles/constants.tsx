import { Tooltip } from "@canonical/react-components";
import classes from "./constants.module.scss";

export const SECURITY_PROFILE_ASSOCIATED_INSTANCES_LIMIT = 5000;
export const ACTIVE_SECURITY_PROFILES_LIMIT = 5;

export const SECURITY_PROFILE_BENCHMARK_LABELS = {
  cis_level1_workstation: "CIS Level 1 Workstation",
  cis_level1_server: "CIS Level 1 Server",
  cis_level2_workstation: "CIS Level 2 Workstation",
  cis_level2_server: "CIS Level 2 Server",
  disa_stig: "DISA-STIG",
};

export const SECURITY_PROFILE_STATUSES = {
  active: { label: "Active", icon: "status-succeeded-small" },
  archived: { label: "Archived", icon: "status-queued-small" },
  "over-limit": {
    label: (
      <div className={classes.statusWithIcon}>
        <span>Over limit</span>
        <Tooltip
          position="top-center"
          message="Only the first 5,000 instances are covered. Instances beyond the limit are not covered."
        >
          <div className={classes.tooltipIcon}>
            <i className="p-icon--help" />
          </div>
        </Tooltip>
      </div>
    ),
    icon: "status-failed-small",
  },
};

export const SECURITY_PROFILE_MODE_LABELS = {
  audit: "Audit only",
  "audit-fix": "Fix and audit",
  "audit-fix-restart": "Fix, restart, audit",
};
