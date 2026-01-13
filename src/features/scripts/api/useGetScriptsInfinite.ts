import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import type { ApiPaginatedResponse } from "@/types/api/ApiPaginatedResponse";
import { type InfiniteData, useInfiniteQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { Script } from "../types";

type ScriptsPage = AxiosResponse<ApiPaginatedResponse<Script>>;

interface UseGetScriptsInfiniteParams {
  readonly search: string;
  readonly limit: number;
  readonly enabled: boolean;
  readonly parentAccessGroup?: string;
}

export const useGetScriptsInfinite = ({
  search,
  limit,
  enabled,
  parentAccessGroup,
}: UseGetScriptsInfiniteParams) => {
  const authFetch = useFetch();
  const queryKey = ["scripts", search, parentAccessGroup] as const;

  const {
    data,
    isPending,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    error,
  } = useInfiniteQuery<
    ScriptsPage,
    AxiosError<ApiError>,
    InfiniteData<ScriptsPage, number>,
    typeof queryKey,
    number
  >({
    queryKey,
    queryFn: async ({ pageParam = 0 }: { pageParam?: number }) =>
      authFetch.get("scripts", {
        params: {
          search: search || undefined,
          script_type: "active",
          limit,
          offset: pageParam * limit,
          parent_access_group: parentAccessGroup,
        },
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      const nextPageParam = lastPageParam + 1;
      if (lastPage.data.count > nextPageParam * limit) {
        return nextPageParam;
      }
      return undefined;
    },
    enabled,
  });

  const scripts = data
    ? data.pages.flatMap((page) => page.data.results)
    : [];

  return {
    scripts,
    isPending,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    error,
  };
};
