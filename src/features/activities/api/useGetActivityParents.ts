import useFetch from "@/hooks/useFetch";
import usePageParams from "@/hooks/usePageParams";
import type { ApiError } from "@/types/api/ApiError";
import type { ApiPaginatedResponse } from "@/types/api/ApiPaginatedResponse";
import type { PaginatedGetHookParams } from "@/types/api/PaginatedGetHookParams";
import type { UseQueryOptions } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { ActivityGroup, GetActivitiesParams } from "../types";

const EMPTY_ACTIVITIES: ActivityGroup[] = [];

const useGetActivityParents = (
  params?: GetActivitiesParams,
  config?: PaginatedGetHookParams,
  options: Omit<
    UseQueryOptions<
      AxiosResponse<ApiPaginatedResponse<ActivityGroup>, AxiosError<ApiError>>
    >,
    "queryKey" | "queryFn"
  > = {},
) => {
  const authFetch = useFetch();
  const {
    query,
    search,
    status,
    fromDate,
    toDate,
    type,
    currentPage,
    pageSize,
  } = usePageParams();

  const queryParts: string[] = [];

  if (params?.query) {
    queryParts.push(params.query);
  }

  if (search) {
    queryParts.push(search);
  }

  if (query) {
    queryParts.push(query);
  }

  if (status) {
    queryParts.push(`status:${status}`);
  }

  if (fromDate) {
    queryParts.push(`created-after:${fromDate}`);
  }

  if (toDate) {
    queryParts.push(`created-before:${toDate}`);
  }

  if (type) {
    queryParts.push(`type:${type}`);
  }

  const requestParams =
    (config?.listenToUrlParams ?? true)
      ? {
          limit: pageSize,
          offset: (currentPage - 1) * pageSize,
          ...params,
          query: queryParts.join(" ") || undefined,
        }
      : params;

  const {
    data: response,
    isFetching,
    isPending,
    refetch,
  } = useQuery<
    AxiosResponse<ApiPaginatedResponse<ActivityGroup>>,
    AxiosError<ApiError>
  >({
    queryKey: ["activities", "parents", requestParams],
    queryFn: async () =>
      authFetch.get("activities/parents", {
        params: requestParams,
      }),
    ...options,
  });

  return {
    activities: response?.data?.results ?? EMPTY_ACTIVITIES,
    activitiesCount: response?.data.count,
    isFetchingActivities: isFetching,
    isGettingActivities: isPending,
    refetchActivities: refetch,
  };
};

export default useGetActivityParents;
