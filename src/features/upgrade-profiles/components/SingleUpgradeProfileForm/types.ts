import type { UpgradeProfile } from "../../types";

export type SingleUpgradeProfileFormProps =
  | {
      action: "add";
    }
  | {
      action: "edit";
      profile: UpgradeProfile;
    };
