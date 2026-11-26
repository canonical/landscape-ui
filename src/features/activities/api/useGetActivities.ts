import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import type { ApiPaginatedResponse } from "@/types/api/ApiPaginatedResponse";
import type { PaginatedGetHookParams } from "@/types/api/PaginatedGetHookParams";
import type { UseQueryOptions } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { Activity, GetActivitiesParams } from "../types";
import useActivitiesQueryParams from "./useActivitiesQueryParams";

const EMPTY_ACTIVITIES: Activity[] = [];

const useGetActivities = (
  params?: GetActivitiesParams,
  config?: PaginatedGetHookParams,
  options: Omit<
    UseQueryOptions<
      AxiosResponse<ApiPaginatedResponse<Activity>, AxiosError<ApiError>>
    >,
    "queryKey" | "queryFn"
  > = {},
) => {
  const authFetch = useFetch();
  const paramsWithPagination = useActivitiesQueryParams(params, config);

  const {
    data: response,
    isFetching,
    isPending,
    refetch,
    error,
  } = useQuery<
    AxiosResponse<ApiPaginatedResponse<Activity>>,
    AxiosError<ApiError>
  >({
    queryKey: ["activities", paramsWithPagination],
    queryFn: async () =>
      authFetch.get("activities", {
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

export default useGetActivities;
