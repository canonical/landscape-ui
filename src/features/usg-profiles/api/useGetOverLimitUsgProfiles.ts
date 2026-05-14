import type { ApiError } from "@/types/api/ApiError";
import type { ApiPaginatedResponse } from "@/types/api/ApiPaginatedResponse";
import type { UseQueryOptions } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import { USG_PROFILE_ASSOCIATED_INSTANCES_LIMIT } from "../constants";
import type { USGProfile } from "../types";
import { useGetUsgProfiles } from "./useGetUsgProfiles";

interface GetOverLimitUSGProfilesParams {
  limit?: number;
  offset?: number;
}

export const useGetOverLimitUsgProfiles = (
  params?: GetOverLimitUSGProfilesParams,
  options?: Omit<
    UseQueryOptions<
      AxiosResponse<ApiPaginatedResponse<USGProfile>, AxiosError<ApiError>>
    >,
    "queryKey" | "queryFn"
  >,
) => {
  const { usgProfiles, isUsgProfilesLoading } = useGetUsgProfiles(
    {
      status: "active",
      ...params,
    },
    options,
  );

  const overLimitUsgProfiles = usgProfiles.filter(
    (profile) =>
      profile.associated_instances > USG_PROFILE_ASSOCIATED_INSTANCES_LIMIT,
  );

  const overLimitUsgProfilesCount = overLimitUsgProfiles.length;

  return {
    hasOverLimitUsgProfiles: !!overLimitUsgProfilesCount,
    overLimitUsgProfiles,
    overLimitUsgProfilesCount,
    isOverLimitUsgProfilesLoading: isUsgProfilesLoading,
  };
};
