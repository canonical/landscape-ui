import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import type { ApiPaginatedResponse } from "@/types/api/ApiPaginatedResponse";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { SecurityProfile } from "../types";
import { ACTIVE_SECURITY_PROFILES_LIMIT } from "@/features/security-profiles";

export const useIsSecurityProfilesLimitReached = () => {
  const authFetch = useFetch();

  const { data: response } = useQuery<
    AxiosResponse<ApiPaginatedResponse<SecurityProfile>>,
    AxiosError<ApiError>
  >({
    queryKey: ["securityProfiles", "check-limit"],
    queryFn: async () =>
      authFetch.get("security-profiles", {
        params: {
          status: "active",
          offset: 0,
          limit: ACTIVE_SECURITY_PROFILES_LIMIT + 1,
        },
      }),
  });

  return Number(response?.data.count) >= ACTIVE_SECURITY_PROFILES_LIMIT;
};
