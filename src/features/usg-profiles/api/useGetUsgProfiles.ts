import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import type { ApiPaginatedResponse } from "@/types/api/ApiPaginatedResponse";
import type { UseQueryOptions } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { USGProfile } from "../types";

interface GetUSGProfilesParams {
  limit?: number;
  offset?: number;
  search?: string;
  status?: string;
  pass_rate_from?: number;
  pass_rate_to?: number;
}

export const useGetUsgProfiles = (
  params?: GetUSGProfilesParams,
  options?: Omit<
    UseQueryOptions<
      AxiosResponse<ApiPaginatedResponse<USGProfile>, AxiosError<ApiError>>
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
    AxiosResponse<ApiPaginatedResponse<USGProfile>>,
    AxiosError<ApiError>
  >({
    queryKey: ["usgProfiles", params],
    queryFn: async ({ signal }) =>
      authFetch.get("usg-profiles", { params, signal }),
    ...options,
  });

  return {
    usgProfiles: response?.data.results ?? [],
    usgProfilesCount: response?.data.count,
    usgProfilesError: error,
    isUsgProfilesLoading: isLoading,
  };
};
