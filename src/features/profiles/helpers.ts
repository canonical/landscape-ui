import type { ProfileType } from "./types";

export const canArchiveProfile = (type: ProfileType) =>
  type == "script" || type == "security";

export const canDuplicateProfile = (type: ProfileType) =>
  type == "reboot" || type == "package" || type == "security";
