import { ProfileTypes } from "@/features/profiles";
import type { FC } from "react";
import SupportPackageProfiles from "./SupportPackageProfiles";
import SupportRebootProfiles from "./SupportRebootProfiles";
import SupportRemovalProfiles from "./SupportRemovalProfiles";
import SupportRepositoryProfiles from "./SupportRepositoryProfiles";
import SupportUpgradeProfiles from "./SupportUpgradeProfiles";

interface SupportProfilesProps {
  readonly type: ProfileTypes;
}

/** The read-only profiles of `type` for the entered account. */
const SupportProfiles: FC<SupportProfilesProps> = ({ type }) => {
  switch (type) {
    case ProfileTypes.repository:
      return <SupportRepositoryProfiles />;
    case ProfileTypes.package:
      return <SupportPackageProfiles />;
    case ProfileTypes.upgrade:
      return <SupportUpgradeProfiles />;
    case ProfileTypes.reboot:
      return <SupportRebootProfiles />;
    case ProfileTypes.removal:
      return <SupportRemovalProfiles />;
    default:
      return null;
  }
};

export default SupportProfiles;
