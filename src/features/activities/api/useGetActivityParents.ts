import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import type { ApiPaginatedResponse } from "@/types/api/ApiPaginatedResponse";
import type { PaginatedGetHookParams } from "@/types/api/PaginatedGetHookParams";
import type { UseQueryOptions } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { ActivityGroup, GetActivitiesParams } from "../types";
import useActivitiesQueryParams from "./useActivitiesQueryParams";

const EMPTY_ACTIVITIES: ActivityGroup[] = [];

const useGetActivityParents = (
  params?: GetActivitiesParams,
  config?: PaginatedGetHookParams,
  options: Omit<
    UseQueryOptions<
      AxiosResponse<ApiPaginatedResponse<ActivityGroup>>,
      AxiosError<ApiError>
    >,
    "queryKey" | "queryFn"
  > = {},
) => {
  const authFetch = useFetch();
  const paramsWithPagination = useActivitiesQueryParams(params, config, true);

  const {
    data: response,
    isFetching,
    isPending,
    refetch,
    error,
  } = useQuery<
    AxiosResponse<ApiPaginatedResponse<ActivityGroup>>,
    AxiosError<ApiError>
  >({
    queryKey: ["activities", "parents", paramsWithPagination],
    queryFn: async () =>
      authFetch.get("activities/parents", {
        params: paramsWithPagination,
      }),
    ...options,
  });

  return {
    activities: response?.data?.results ?? EMPTY_ACTIVITIES,
    activitiesCount: response?.data.count,
    isFetchingActivities: isFetching,
    isGettingActivities: isPending,
    refetchActivities: refetch,
    activitiesError: error,
  };
};

export default useGetActivityParents;
