import { SECURITY_PROFILE_ASSOCIATED_INSTANCES_LIMIT } from "../constants";
import { useGetSecurityProfiles } from "./useGetSecurityProfiles";

export const useGetOverLimitSecurityProfiles = () => {
  const { securityProfiles, isSecurityProfilesLoading } =
    useGetSecurityProfiles({
      status: "active",
    });

  const overLimitSecurityProfiles = securityProfiles.filter(
    (profile) =>
      profile.associated_instances >=
      SECURITY_PROFILE_ASSOCIATED_INSTANCES_LIMIT,
  );

  const overLimitSecurityProfilesCount = overLimitSecurityProfiles.length;

  return {
    hasOverLimitSecurityProfiles: !!overLimitSecurityProfilesCount,
    overLimitSecurityProfiles,
    overLimitSecurityProfilesCount,
    isOverLimitSecurityProfilesLoading: isSecurityProfilesLoading,
  };
};
