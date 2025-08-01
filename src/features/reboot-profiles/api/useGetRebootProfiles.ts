import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import type { ApiPaginatedResponse } from "@/types/api/ApiPaginatedResponse";
import type { QueryFnType } from "@/types/api/QueryFnType";
import type { UseQueryOptions } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { RebootProfile } from "../types";

export default function useGetRebootProfiles() {
  const authFetch = useFetch();

  const getRebootProfilesQuery: QueryFnType<
    AxiosResponse<ApiPaginatedResponse<RebootProfile>>,
    Omit<
      UseQueryOptions<
        AxiosResponse<ApiPaginatedResponse<RebootProfile>>,
        AxiosError<ApiError>
      >,
      "queryKey" | "queryFn"
    >
  > = (config = {}) =>
    useQuery<
      AxiosResponse<ApiPaginatedResponse<RebootProfile>>,
      AxiosError<ApiError>
    >({
      queryKey: ["rebootprofiles"],
      queryFn: async () => authFetch.get("rebootprofiles"),
      ...config,
    });

  const { data, isPending, error } = getRebootProfilesQuery();

  return {
    rebootProfiles: data?.data.results || [],
    isPending,
    error,
  };
}
