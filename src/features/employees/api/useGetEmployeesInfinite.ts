import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import type { ApiPaginatedResponse } from "@/types/api/ApiPaginatedResponse";
import { type InfiniteData, useInfiniteQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { Employee } from "../types";

type EmployeesPage = AxiosResponse<ApiPaginatedResponse<Employee>>;

interface UseGetEmployeesInfiniteParams {
  readonly search: string;
  readonly limit: number;
  readonly enabled: boolean;
}

export const useGetEmployeesInfinite = ({
  search,
  limit,
  enabled,
}: UseGetEmployeesInfiniteParams) => {
  const authFetch = useFetch();
  const queryKey = ["employees", search] as const;

  const {
    data,
    isPending,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    error,
  } = useInfiniteQuery<
    EmployeesPage,
    AxiosError<ApiError>,
    InfiniteData<EmployeesPage, number>,
    typeof queryKey,
    number
  >({
    queryKey,
    queryFn: async ({ pageParam = 0 }: { pageParam?: number }) =>
      authFetch.get("employees", {
        params: {
          search: search || undefined,
          limit,
          offset: pageParam * limit,
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

  const employees = data ? data.pages.flatMap((page) => page.data.results) : [];

  return {
    employees,
    isPending,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    error,
  };
};
