import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import type {
  InfiniteData,
  UseInfiniteQueryOptions,
} from "@tanstack/react-query";
import { useInfiniteQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { InstalledSnapWithCount, SnapStatus } from "../types";

interface SearchSnapsRequest {
  computer_ids: number[];
  limit?: number;
  search?: string;
  status?: SnapStatus;
}

export interface SearchSnapsResponse {
  results: InstalledSnapWithCount[];
  count: number;
  previous: string | null;
  next: string | null;
}

const DEFAULT_LIMIT = 10;

export const useGetBulkInstalledSnaps = (
  params: SearchSnapsRequest,
  options: Omit<
    UseInfiniteQueryOptions<
      AxiosResponse<SearchSnapsResponse>,
      AxiosError<ApiError>,
      InfiniteData<AxiosResponse<SearchSnapsResponse>>,
      (string | SearchSnapsRequest)[],
      number
    >,
    "queryKey" | "queryFn" | "getNextPageParam" | "initialPageParam"
  > = {},
) => {
  const authFetch = useFetch();
  const limit = params.limit ?? DEFAULT_LIMIT;
  const queryParams = { ...params, limit };

  return useInfiniteQuery<
    AxiosResponse<SearchSnapsResponse>,
    AxiosError<ApiError>,
    InfiniteData<AxiosResponse<SearchSnapsResponse>>,
    (string | SearchSnapsRequest)[],
    number
  >({
    queryKey: ["snaps", queryParams],
    queryFn: async ({ pageParam = 0 }) =>
      authFetch.get("snaps/installed", {
        params: { ...queryParams, offset: pageParam * limit },
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      const nextPageParam = lastPageParam + 1;

      if (lastPage.data.count > nextPageParam * limit) {
        return nextPageParam;
      } else {
        return;
      }
    },
    ...options,
  });
};
