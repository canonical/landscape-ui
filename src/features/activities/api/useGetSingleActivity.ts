import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import type { UseQueryOptions } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { Activity, GetSingleActivityParams } from "../types";

const useGetSingleActivity = (
  { activityId, ...queryParams }: GetSingleActivityParams,
  options: Omit<
    UseQueryOptions<AxiosResponse<Activity>, AxiosError<ApiError>>,
    "queryKey" | "queryFn"
  > = {},
) => {
  const authFetch = useFetch();

  const {
    data: response,
    isPending,
    isError,
    error,
  } = useQuery<AxiosResponse<Activity>, AxiosError<ApiError>>({
    queryKey: ["activities", { activityId, ...queryParams }],
    queryFn: async () =>
      authFetch.get(`activities/${activityId}`, { params: queryParams }),
    ...options,
  });

  return {
    activity: response?.data,
    activityError: error,
    isActivityError: isError,
    isGettingActivity: isPending,
  };
};

export default useGetSingleActivity;
