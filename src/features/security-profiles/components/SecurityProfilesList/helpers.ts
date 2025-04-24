export const getNotificationMessage = (
  mode: "audit" | "audit-fix" | "audit-fix-restart",
) => {
  switch (mode) {
    case "audit-fix-restart":
      return "Applying remediation fixes, restarting associated instances, and generating an audit have been queued in Activities.";
    case "audit":
      return "Applying remediation fixes, restarting associated instances, and generating an audit have been queued in Activities.";
    default:
      return "Applying remediation fixes and generating an audit have been queued in Activities.";
  }
};
