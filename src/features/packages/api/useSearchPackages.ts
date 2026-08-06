import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import { useInfiniteQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type {
  InfiniteData,
  UseInfiniteQueryOptions,
} from "@tanstack/react-query";
import type { Package } from "../types/Package";
import type { FilterState } from "../types/FilterState";

export interface SearchPackagesRequest {
  computer_query: string;
  text?: string;
  names?: string[];
  installed?: FilterState;
  available?: FilterState;
  upgrade?: FilterState;
  held?: FilterState;
  security?: FilterState;
  limit?: number;
  offset?: number;
}

export interface SearchPackagesResponse {
  packages: Package[];
  count: number;
  prev: string | null;
  next: string | null;
}

export default function useSearchPackages(
  params: SearchPackagesRequest,
  options: Omit<
    UseInfiniteQueryOptions<
      AxiosResponse<SearchPackagesResponse>,
      AxiosError<ApiError>,
      InfiniteData<AxiosResponse<SearchPackagesResponse>>,
      (string | SearchPackagesRequest)[],
      number
    >,
    "queryKey" | "queryFn" | "getNextPageParam" | "initialPageParam"
  > = {},
) {
  const authFetch = useFetch();

  const { limit = 0 } = params;

  return useInfiniteQuery<
    AxiosResponse<SearchPackagesResponse>,
    AxiosError<ApiError>,
    InfiniteData<AxiosResponse<SearchPackagesResponse>>,
    (string | SearchPackagesRequest)[],
    number
  >({
    queryKey: ["packages", params],
    queryFn: async ({ pageParam }) => {
      return authFetch.post("packages:search", {
        ...params,
        offset: pageParam * limit,
      });
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      const nextPageParam = lastPageParam + 1;

      if (lastPage.data.count > nextPageParam * limit) {
        return nextPageParam;
      }
    },
    ...options,
  });
}
