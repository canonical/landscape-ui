import type { ProfileType } from "@/types/Profile";

export const getProfileType = (profileType: ProfileType) => {
  return {
    package: "Package",
    removal: "Removal",
    repository: "Repository",
    reboot: "Reboot",
    script: "Script",
    usg: "USG",
    upgrade: "Upgrade",
    wsl: "WSL",
  }[profileType];
};
