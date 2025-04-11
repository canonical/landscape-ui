export const getNotificationMessage = (
  mode: "audit" | "fix-audit" | "fix-restart-audit",
) => {
  switch (mode) {
    case "fix-restart-audit":
      return "Applying remediation fixes, restarting associated instances, and generating an audit have been queued in Activities.";
    case "audit":
      return "Applying remediation fixes, restarting associated instances, and generating an audit have been queued in Activities.";
    default:
      return "Applying remediation fixes and generating an audit have been queued in Activities.";
  }
};
