import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import type { ApiPaginatedResponse } from "@/types/api/ApiPaginatedResponse";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { SecurityProfile } from "../types";

export const useGetOverLimitSecurityProfiles = () => {
  const authFetch = useFetch();

  const { data: response, isLoading } = useQuery<
    AxiosResponse<ApiPaginatedResponse<SecurityProfile>>,
    AxiosError<ApiError>
  >({
    queryKey: ["securityProfiles", "over-limit"],
    queryFn: async () =>
      authFetch.get("security-profiles", {
        params: {
          status: "over-limit",
          offset: 0,
          limit: 1,
        },
      }),
  });

  return {
    hasOverLimitSecurityProfiles: Number(response?.data.count) > 0,
    overLimitSecurityProfilesCount: Number(response?.data.count),
    isOverLimitSecurityProfilesLoading: isLoading,
  };
};
