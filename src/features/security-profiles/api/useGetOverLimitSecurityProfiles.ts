import type { ApiError } from "@/types/api/ApiError";
import type { ApiPaginatedResponse } from "@/types/api/ApiPaginatedResponse";
import type { UseQueryOptions } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import { SECURITY_PROFILE_ASSOCIATED_INSTANCES_LIMIT } from "../constants";
import type { SecurityProfile } from "../types";
import { useGetSecurityProfiles } from "./useGetSecurityProfiles";

interface GetOverLimitSecurityProfilesParams {
  limit?: number;
  offset?: number;
}

export const useGetOverLimitSecurityProfiles = (
  params?: GetOverLimitSecurityProfilesParams,
  options?: Omit<
    UseQueryOptions<
      AxiosResponse<ApiPaginatedResponse<SecurityProfile>, AxiosError<ApiError>>
    >,
    "queryKey" | "queryFn"
  >,
) => {
  const { securityProfiles, isSecurityProfilesLoading } =
    useGetSecurityProfiles(
      {
        status: "active",
        ...params,
      },
      options,
    );

  const overLimitSecurityProfiles = securityProfiles.filter(
    (profile) =>
      profile.associated_instances >
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
