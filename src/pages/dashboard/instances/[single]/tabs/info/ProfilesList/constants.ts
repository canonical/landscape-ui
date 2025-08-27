import type { Profile } from "@/types/Profile";
import type { SelectOption } from "@/types/SelectOption";

export const FILTER_OPTIONS: Record<Profile["type"], SelectOption> = {
  package: {
    label: "Package",
    value: "package",
  },
  reboot: { label: "Reboot", value: "reboot" },
  removal: { label: "Removal", value: "removal" },
  repository: {
    label: "Repository",
    value: "repository",
  },
  script: {
    label: "Script",
    value: "script",
  },
  security: {
    label: "Security",
    value: "security",
  },
  upgrade: {
    label: "Upgrade",
    value: "upgrade",
  },
  wsl: {
    label: "WSL",
    value: "wsl",
  },
};
