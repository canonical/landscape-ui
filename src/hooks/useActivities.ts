import { QueryFnType } from "../types/QueryFnType";
import { Activity } from "../types/Activity";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { ApiError } from "../types/ApiError";
import useFetchOld from "./useFetchOld";
import useFetch from "./useFetch";
import { ApiPaginatedResponse } from "../types/ApiPaginatedResponse";

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
  const authFetchOld = useFetchOld();
  const authFetch = useFetch();
  const queryClient = useQueryClient();

  const getActivitiesQuery: QueryFnType<
    AxiosResponse<ApiPaginatedResponse<Activity>>,
    GetActivitiesParams
  > = (queryParams = {}, config = {}) => {
    return useQuery<
      AxiosResponse<ApiPaginatedResponse<Activity>>,
      AxiosError<ApiError>
    >({
      queryKey: ["activities", queryParams],
      queryFn: () =>
        authFetch!.get("activities", {
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
        authFetchOld!.get("GetActivityTypes", { params: queryParams }),
      ...config,
    });
  };

  const cancelActivitiesQuery = useMutation<
    string[],
    AxiosError<ApiError>,
    CancelActivitiesParams
  >({
    mutationKey: ["activities", "cancel"],
    mutationFn: (params) => authFetchOld!.get("CancelActivities", { params }),
    onSuccess: () => queryClient.invalidateQueries(["activities"]),
  });

  const approveActivitiesQuery = useMutation<
    string[],
    AxiosError<ApiError>,
    ApproveActivitiesParams
  >({
    mutationKey: ["activities", "approve"],
    mutationFn: (params) => authFetchOld!.get("ApproveActivities", { params }),
    onSuccess: () => queryClient.invalidateQueries(["activities"]),
  });

  return {
    getActivitiesQuery,
    getActivityTypesQuery,
    cancelActivitiesQuery,
    approveActivitiesQuery,
  };
}
