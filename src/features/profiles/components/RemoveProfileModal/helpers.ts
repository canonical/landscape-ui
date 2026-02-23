import type { ProfileType } from "../../types";

export const getModalMessage = (type: ProfileType, profileName: string) => {
  switch (type) {
    case 'script':
      return `Archiving "${profileName}" script profile will prevent it from running in the future.`;
    case 'security':
      return `Archiving "${profileName}" security profile will prevent it from running. However, it will NOT delete past audit data or remove the profile details. You will not be able to reactivate the profile after it has been archived.`;
    case 'wsl':
      return `Removing "${profileName}" WSL profile will not remove the WSL child instances associated with it.`;
    case 'reboot':
      return `Removing "${profileName}" may impact scheduled reboots for associated instances.`;
    default:
      return `This will remove "${profileName}" ${type} profile.`;
  }
};

export const getNotificationMessage = (type: ProfileType) => {
  switch (type) {
    case 'script':
      return "It will no longer run.";
    case 'security':
      return "It will no longer run, but past audit data and profile details will remain accessible for selected duration of the retention period.";
    case 'wsl':
      return "Instances created by this profile won't be affected.";
    default:
      return "";
  }
};
