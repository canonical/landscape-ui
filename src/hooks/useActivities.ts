import { QueryFnType } from "../types/QueryFnType";
import { Activity } from "../types/Activity";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { ApiError } from "../types/ApiError";
import useFetchOld from "./useFetchOld";

interface GetActivitiesParams {
  query?: string;
  limit?: number;
  offset?: number;
}

interface CancelActivitiesParams {
  query: string;
}

interface ApproveActivitiesParams {
  query: string;
}

export default function useActivities() {
  const authFetch = useFetchOld();
  const queryClient = useQueryClient();

  const getActivitiesQuery: QueryFnType<
    AxiosResponse<Activity[]>,
    GetActivitiesParams
  > = (queryParams = {}, config = {}) => {
    return useQuery<AxiosResponse<Activity[]>, AxiosError<ApiError>>({
      queryKey: ["activities", { queryParams }],
      queryFn: () =>
        authFetch!.get("GetActivities", {
          params: queryParams,
        }),
      ...config,
    });
  };

  const getActivityTypesQuery: QueryFnType<AxiosResponse<string[]>, {}> = (
    queryParams = {},
    config = {},
  ) => {
    return useQuery<AxiosResponse<string[]>, AxiosError<ApiError>>({
      queryKey: ["activityTypes"],
      queryFn: () =>
        authFetch!.get("GetActivityTypes", { params: queryParams }),
      ...config,
    });
  };

  const cancelActivitiesQuery = useMutation<
    string[],
    AxiosError<ApiError>,
    CancelActivitiesParams
  >({
    mutationKey: ["activities", "cancel"],
    mutationFn: (params) => authFetch!.get("CancelActivities", { params }),
    onSuccess: () => queryClient.invalidateQueries(["activities"]),
  });

  const approveActivitiesQuery = useMutation<
    string[],
    AxiosError<ApiError>,
    ApproveActivitiesParams
  >({
    mutationKey: ["activities", "approve"],
    mutationFn: (params) => authFetch!.get("ApproveActivities", { params }),
    onSuccess: () => queryClient.invalidateQueries(["activities"]),
  });

  return {
    getActivitiesQuery,
    getActivityTypesQuery,
    cancelActivitiesQuery,
    approveActivitiesQuery,
  };
}
