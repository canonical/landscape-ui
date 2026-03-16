import { ProfileTypes } from "../../helpers";

export const getModalMessage = (type: ProfileTypes, profileName: string) => {
  switch (type) {
    case ProfileTypes.script:
      return `Archiving "${profileName}" script profile will prevent it from running in the future.`;
    case ProfileTypes.security:
      return `Archiving "${profileName}" security profile will prevent it from running. However, it will NOT delete past audit data or remove the profile details. You will not be able to reactivate the profile after it has been archived.`;
    case ProfileTypes.wsl:
      return `Removing "${profileName}" WSL profile will not remove the WSL child instances associated with it.`;
    case ProfileTypes.reboot:
      return `Removing "${profileName}" may impact scheduled reboots for associated instances.`;
    default:
      return `This will remove "${profileName}" ${type} profile.`;
  }
};

export const getNotificationMessage = (type: ProfileTypes) => {
  switch (type) {
    case ProfileTypes.script:
      return "It will no longer run.";
    case ProfileTypes.security:
      return "It will no longer run, but past audit data and profile details will remain accessible for selected duration of the retention period.";
    case ProfileTypes.wsl:
      return "Instances created by this profile won't be affected.";
    default:
      return "";
  }
};
