import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/ApiError";
import type { ApiPaginatedResponse } from "@/types/ApiPaginatedResponse";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { SecurityProfile, SecurityProfileStatus } from "../types";

interface GetSecurityProfilesParams {
  limit: number;
  offset: number;
  search?: string;
  status?: SecurityProfileStatus;
  passRateFrom?: number;
  passRateTo?: number;
}

export const useGetSecurityProfiles = (params: GetSecurityProfilesParams) => {
  const authFetch = useFetch();

  const { data: response, isLoading } = useQuery<
    AxiosResponse<ApiPaginatedResponse<SecurityProfile>>,
    AxiosError<ApiError>
  >({
    queryKey: ["security_profiles", params],
    queryFn: async () => authFetch.get("security_profiles", { params }),
  });

  return {
    securityProfiles: response?.data.results ?? [],
    securityprofilesCount: response?.data.count,
    isSecurityProfilesLoading: isLoading,
  };
};
