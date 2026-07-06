import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import type { ApiPaginatedResponse } from "@/types/api/ApiPaginatedResponse";
import type { UseQueryOptions } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { AvailableSnap } from "../types";

interface GetAvailableSnapsParams {
  instance_id: number;
  query: string;
}

export const useGetAvailableSnaps = (
  params: GetAvailableSnapsParams,
  options: Omit<
    UseQueryOptions<
      AxiosResponse<ApiPaginatedResponse<AvailableSnap>>,
      AxiosError<ApiError>
    >,
    "queryKey" | "queryFn"
  > = {},
) => {
  const authFetch = useFetch();

  const { instance_id, query } = params;
  const sanitizedParams = { name_startswith: query || undefined };

  const { data, isFetching } = useQuery<
    AxiosResponse<ApiPaginatedResponse<AvailableSnap>>,
    AxiosError<ApiError>
  >({
    queryKey: ["snaps", "available", { instance_id, ...sanitizedParams }],
    queryFn: async () =>
      authFetch.get(`computers/${instance_id}/snaps/available`, {
        params: sanitizedParams,
      }),
    ...options,
  });

  return {
    availableSnaps: data?.data.results ?? [],
    isFetchingAvailableSnaps: isFetching,
  };
};
