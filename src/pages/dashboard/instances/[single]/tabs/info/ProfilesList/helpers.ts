import type { ProfileType } from "@/types/Profile";

export const getProfileType = (profileType: ProfileType) => {
  return {
    package: "Package",
    removal: "Removal",
    repository: "Repository",
    reboot: "Reboot",
    script: "Script",
    security: "Security",
    upgrade: "Upgrade",
    wsl: "WSL",
  }[profileType];
};
