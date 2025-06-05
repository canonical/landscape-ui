import { DISPLAY_DATE_FORMAT } from "@/constants";
import moment from "moment";

export const getStatusTooltipMessage = (type: string, expiryDate: string) => {
  switch (type) {
    case "Fully patched":
      return "All available kernel security patches have been applied. You have no pending patches.";
    case "Kernel upgrade available": {
      const date = moment(expiryDate);

      return `A new kernel version is available.${date.isValid() ? ` The current version is covered by Livepatch until ${date.format(DISPLAY_DATE_FORMAT)}` : ""}`;
    }
    case "Restart required":
      return "Low and/or medium patches have been installed. You must restart to complete patching.";
    case "End of life":
      return "The kernel is no longer covered by Livepatch. It is not getting high and critical security patches.";
    case "Livepatch disabled":
      return "Livepatch is disabled. Kernel patches will not be applied automatically until you enabled Livepatch.";
    default:
      return "There was an error getting the status.";
  }
};

export const getStatusIcon = (type: string) => {
  switch (type) {
    case "Patched by Livepatch":
    case "Fully patched":
    case "Kernel upgrade available":
      return "status-succeeded-small";
    case "Restart required":
      return "status-waiting-small";
    case "End of life":
      return "status-failed-small";
    default:
      return "status-failed-small";
  }
};

export const getLivepatchCoverageIcon = (
  livepatchEnabled: boolean,
  expiryDate: string,
): string => {
  const expiry = moment(expiryDate);
  const today = moment();
  const diffDays = expiry.diff(today, "days");

  if (diffDays < 0 || !livepatchEnabled || !moment(expiryDate).isValid()) {
    return "status-failed-small";
  } else if (diffDays < 7) {
    return "status-waiting-small";
  } else {
    return "status-succeeded-small";
  }
};

export const getLivepatchCoverageDisplayValue = (
  livepatchEnabled: boolean,
  expiryDate: string,
): string => {
  if (!livepatchEnabled) {
    return "Livepatch is disabled";
  }

  const expiry = moment(expiryDate);
  const today = moment();
  const diffDays = expiry.diff(today, "days");

  if (diffDays < 0) {
    return "Expired";
  } else {
    return `Expires on ${moment(expiryDate).format(DISPLAY_DATE_FORMAT)}`;
  }
};
