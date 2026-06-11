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

  const { data, isFetching } = useQuery<
    AxiosResponse<ApiPaginatedResponse<AvailableSnap>>,
    AxiosError<ApiError>
  >({
    queryKey: ["snaps", "available", { ...params }],
    queryFn: async () =>
      authFetch.get(
        `computers/${params.instance_id}/snaps/available?name_startswith=${encodeURIComponent(params.query)}`,
      ),
    ...options,
  });

  return {
    availableSnaps: data?.data.results ?? [],
    isFetchingAvailableSnaps: isFetching,
  };
};
