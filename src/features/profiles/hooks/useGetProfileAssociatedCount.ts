import { useGetInstances } from "@/features/instances";
import {
  isRemovalProfile,
  isScriptProfile,
  isUpgradeProfile,
  hasComplianceData,
  isRebootProfile,
  isRepositoryProfile,
  isSecurityProfile,
  hasAssociations,
} from "../helpers";
import type { Profile } from "../types";

export const useGetProfileAssociatedCount = (profile: Profile) => {
  const isAssociationQueryEnabled =
    isRepositoryProfile(profile) && hasAssociations(profile);

  const { instancesCount = 0, isGettingInstances } = useGetInstances(
    {
      limit: 1,
      query: `profile:repository:${profile.id}`,
    },
    { listenToUrlParams: false },
    { enabled: isAssociationQueryEnabled },
  );

  const getAssociationFromProfile = () => {
    if (
      isRemovalProfile(profile) ||
      isScriptProfile(profile) ||
      isUpgradeProfile(profile)
    ) {
      return profile.computers.num_associated_computers;
    }
    if (hasComplianceData(profile)) {
      return profile.computers.constrained.length;
    }
    if (isRebootProfile(profile)) {
      return profile.num_computers;
    }
    if (isSecurityProfile(profile)) {
      return profile.associated_instances;
    }
    return instancesCount;
  };

  return {
    associatedCount: getAssociationFromProfile(),
    isGettingInstances: isAssociationQueryEnabled ? isGettingInstances : false,
  };
};
