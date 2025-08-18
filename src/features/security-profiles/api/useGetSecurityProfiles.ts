import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import type { ApiPaginatedResponse } from "@/types/api/ApiPaginatedResponse";
import type { UseQueryOptions } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { SecurityProfile } from "../types";

interface GetSecurityProfilesParams {
  limit?: number;
  offset?: number;
  search?: string;
  status?: string;
  pass_rate_from?: number;
  pass_rate_to?: number;
}

export const useGetSecurityProfiles = (
  params?: GetSecurityProfilesParams,
  options?: Omit<
    UseQueryOptions<
      AxiosResponse<ApiPaginatedResponse<SecurityProfile>, AxiosError<ApiError>>
    >,
    "queryKey" | "queryFn"
  >,
) => {
  const authFetch = useFetch();

  const {
    data: response,
    isLoading,
    error,
  } = useQuery<
    AxiosResponse<ApiPaginatedResponse<SecurityProfile>>,
    AxiosError<ApiError>
  >({
    queryKey: ["securityProfiles", params],
    queryFn: async ({ signal }) =>
      authFetch.get("security-profiles", { params, signal }),
    ...options,
  });

  return {
    securityProfiles: response?.data.results ?? [],
    securityProfilesCount: response?.data.count,
    securityProfilesError: error,
    isSecurityProfilesLoading: isLoading,
  };
};
