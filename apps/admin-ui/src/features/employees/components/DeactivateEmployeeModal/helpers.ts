import type { FormProps } from "./types";

export const getDeactivationModalTitle = (
  employeeName: string,
  values: FormProps,
): string => {
  if (values.removeFromLandscape && values.sanitizeInstances) {
    return `Off-board ${employeeName}`;
  }

  return `Deactivate ${employeeName}`;
};

export const getDeactivationModalButtonTitle = (values: FormProps): string => {
  if (values.removeFromLandscape && values.sanitizeInstances) {
    return "Off-board";
  } else if (values.removeFromLandscape) {
    return "Deactivate and remove";
  } else if (values.sanitizeInstances) {
    return "Deactivate and sanitize";
  } else {
    return "Deactivate";
  }
};

export const isDisabledConfirmationButton = (values: FormProps): boolean => {
  if (
    (values.sanitizeInstances &&
      values.sanitizationConfirmationText !== "sanitize instances") ||
    (values.removeFromLandscape &&
      values.removeFromLandscapeConfirmationText !== "remove instances")
  ) {
    return true;
  }

  if (
    values.sanitizeInstances &&
    values.removeFromLandscape &&
    values.sanitizationConfirmationText !== "sanitize instances" &&
    values.removeFromLandscapeConfirmationText !== "remove instances"
  ) {
    return true;
  }

  return false;
};

export const getDeactivationMessage = (
  employeeName: string,
  sanitize: boolean,
  remove: boolean,
) => {
  if (sanitize && remove) {
    return {
      notificationTitle: `You have successfully deactivated ${employeeName} and initiated both Sanitization and Removal of their instances`,
      notificationMessage:
        "Sanitization and removal of this employee’s instances have been queued. The data will be permanently irrecoverable once complete. To manage the instances again, they will need to be re-registered in Landscape.",
    };
  }

  if (sanitize) {
    return {
      notificationTitle: `You have successfully deactivated ${employeeName} and initiated sanitization of their instances`,
      notificationMessage: `Sanitization of the ${employeeName}’s instances has been queued in Activities. The data will be permanently irrecoverable once complete.`,
    };
  }

  if (remove) {
    return {
      notificationTitle: `You have successfully deactivated ${employeeName} and initiated the Removal of their instances`,
      notificationMessage:
        "The removal of this employee’s instances has been queued. This process will delete all stored data. To manage them again, they will need to be re-registered in Landscape.",
    };
  }

  return {
    notificationTitle: `You have successfully deactivated ${employeeName}`,
    notificationMessage:
      "This employee won’t be able to log in to Landscape or register new instances with their account.",
  };
};
