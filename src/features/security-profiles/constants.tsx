import { Tooltip } from "@canonical/react-components";
import classes from "./constants.module.scss";

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
        <span className={classes.iconWrapper}>
          <Tooltip
            position="top-center"
            message="Only the first 5,000 instances are covered. Instances beyond the limit are not covered."
          >
            <i className="p-icon--help" role="img" aria-label="Help icon" />
          </Tooltip>
        </span>
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
