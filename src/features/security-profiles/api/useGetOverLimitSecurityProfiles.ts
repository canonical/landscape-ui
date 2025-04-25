import { SECURITY_PROFILE_ASSOCIATED_INSTANCES_LIMIT } from "../constants";
import { useGetSecurityProfiles } from "./useGetSecurityProfiles";

interface GetOverLimitSecurityProfilesParams {
  limit?: number;
  offset?: number;
}

export const useGetOverLimitSecurityProfiles = (
  params?: GetOverLimitSecurityProfilesParams,
) => {
  const { securityProfiles, isSecurityProfilesLoading } =
    useGetSecurityProfiles({
      status: "active",
      ...params,
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
