import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import type { ApiPaginatedResponse } from "@/types/api/ApiPaginatedResponse";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { SecurityProfile } from "../types";
import type { QueryFnType } from "@/types/QueryFnType";

interface GetSecurityProfilesParams {
  limit?: number;
  offset?: number;
  search?: string;
  status?: string;
  passRateFrom?: number;
  passRateTo?: number;
}

export const useGetSecurityProfiles = (params?: GetSecurityProfilesParams) => {
  const authFetch = useFetch();

  const { data: response, isLoading } = useQuery<
    AxiosResponse<ApiPaginatedResponse<SecurityProfile>>,
    AxiosError<ApiError>
  >({
    queryKey: ["securityProfiles", params],
    queryFn: async () => authFetch.get("security-profiles", { params }),
  });

  const { data: overLimitResponse, isLoading: isOverLimitLoading } = useQuery<
    AxiosResponse<ApiPaginatedResponse<SecurityProfile>>,
    AxiosError<ApiError>
  >({
    queryKey: ["securityProfiles", "over-limit"],
    queryFn: async () =>
      authFetch.get("security-profiles", {
        params: { statuses: ["over-limit"], limit: 1, offset: 0 },
      }),
  });

  const getSecurityProfilesQuery: QueryFnType<
    AxiosResponse<ApiPaginatedResponse<SecurityProfile>>,
    GetSecurityProfilesParams
  > = (queryParams = {}, config = {}) =>
    useQuery<
      AxiosResponse<ApiPaginatedResponse<SecurityProfile>>,
      AxiosError<ApiError>
    >({
      queryKey: ["securityProfiles", queryParams],
      queryFn: async () =>
        authFetch.get("securityProfiles", { params: queryParams }),
      ...config,
    });

  const hasOverLimitProfiles =
    (overLimitResponse?.data?.results?.length ?? 0) > 0;

  return {
    getSecurityProfilesQuery,
    securityProfiles: response?.data.results ?? [],
    securityProfilesCount: response?.data.count ?? 0,
    isSecurityProfilesLoading: isLoading,
    hasOverLimitProfiles,
    isOverLimitLoading,
  };
};
