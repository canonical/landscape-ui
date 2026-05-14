import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import type { ApiPaginatedResponse } from "@/types/api/ApiPaginatedResponse";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { USGProfile } from "../types";
import { ACTIVE_USG_PROFILES_LIMIT } from "../constants";

export const useIsUsgProfilesLimitReached = () => {
  const authFetch = useFetch();

  const { data: response } = useQuery<
    AxiosResponse<ApiPaginatedResponse<USGProfile>>,
    AxiosError<ApiError>
  >({
    queryKey: ["usgProfiles", "check-limit"],
    queryFn: async () =>
      authFetch.get("usg-profiles", {
        params: {
          status: "active",
          offset: 0,
          limit: ACTIVE_USG_PROFILES_LIMIT + 1,
        },
      }),
  });

  return Number(response?.data.count) >= ACTIVE_USG_PROFILES_LIMIT;
};
