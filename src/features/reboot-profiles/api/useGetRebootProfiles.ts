import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import type { ApiPaginatedResponse } from "@/types/api/ApiPaginatedResponse";
import type { UseQueryOptions } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { RebootProfile } from "../types";

export default function useGetRebootProfiles(
  config: Omit<
    UseQueryOptions<
      AxiosResponse<ApiPaginatedResponse<RebootProfile>, AxiosError<ApiError>>
    >,
    "queryKey" | "queryFn"
  > = {},
) {
  const authFetch = useFetch();

  const { data, isPending, error } = useQuery<
    AxiosResponse<ApiPaginatedResponse<RebootProfile>>,
    AxiosError<ApiError>
  >({
    queryKey: ["rebootprofiles"],
    queryFn: async ({ signal }) => authFetch.get("rebootprofiles", { signal }),
    ...config,
  });

  return {
    rebootProfiles: data?.data.results ?? [],
    rebootProfilesCount: data?.data.count,
    rebootProfilesError: error,
    isGettingRebootProfiles: isPending,
  };
}
