import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import type { ApiPaginatedResponse } from "@/types/api/ApiPaginatedResponse";
import type { UseQueryOptions } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { USGProfile } from "../types";

export const useGetUsgProfile = (
  id: number,
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
    isPending,
    error,
  } = useQuery<
    AxiosResponse<ApiPaginatedResponse<USGProfile>>,
    AxiosError<ApiError>
  >({
    queryKey: ["usgProfile", id],
    queryFn: async ({ signal }) => authFetch.get("usg-profiles", { signal }),
    ...options,
  });

  const usgProfile = response?.data.results.find(
    ({ id: usgProfileId }) => usgProfileId === id,
  );

  return {
    usgProfile,
    usgProfileError:
      response && !usgProfile
        ? new Error("The USG profile could not be found.")
        : error,
    isGettingUsgProfile: isPending,
  };
};
