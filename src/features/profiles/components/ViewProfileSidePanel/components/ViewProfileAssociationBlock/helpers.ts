import {
  hasComplianceData,
  isRebootProfile,
  isRemovalProfile,
  isRepositoryProfile,
  isScriptProfile,
  isSecurityProfile,
  isUpgradeProfile
} from "../../../../helpers";
import type { Profile } from "../../../../types";

export const getAssociationData = (profile: Profile) => {
  if (isRemovalProfile(profile) || isScriptProfile(profile) || isUpgradeProfile(profile)) {
    return profile.computers.num_associated_computers;
  }
  if (hasComplianceData(profile)) {
    return profile.computers.constrained.length;
  }
  if (isRebootProfile(profile)) {
    return profile.num_computers;
  }
  if (isRepositoryProfile(profile)) {
    return profile.pending_count;
  }
  if (isSecurityProfile(profile)) {
    return profile.associated_instances;
  }
  return 0;
};
