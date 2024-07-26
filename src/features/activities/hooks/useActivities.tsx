import { AxiosError, AxiosResponse } from "axios";
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import { Activity, ActivityCommon } from "../types";
import useFetch from "@/hooks/useFetch";
import useFetchOld from "@/hooks/useFetchOld";
import { ApiError } from "@/types/ApiError";
import { ApiPaginatedResponse } from "@/types/ApiPaginatedResponse";
import { QueryFnType } from "@/types/QueryFnType";
import useSidePanel from "@/hooks/useSidePanel";
import { lazy, Suspense } from "react";
import LoadingState from "@/components/layout/LoadingState";

const ActivityDetails = lazy(() => import("../components/ActivityDetails"));

interface GetActivitiesParams {
  limit?: number;
  offset?: number;
  query?: string;
}

interface GetSingleActivityParams {
  activityId: number;
}

interface CancelActivitiesParams {
  query: string;
}

interface ApproveActivitiesParams {
  query: string;
}

interface RedoUndoActivitiesParams {
  activity_ids: number[];
}

export default function useActivities() {
  const authFetchOld = useFetchOld();
  const authFetch = useFetch();
  const queryClient = useQueryClient();
  const { setSidePanelContent } = useSidePanel();

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

  const getSingleActivityQuery = (
    { activityId, ...queryParams }: GetSingleActivityParams,
    config: Omit<
      UseQueryOptions<AxiosResponse<Activity>, AxiosError<ApiError>>,
      "queryKey" | "queryFn"
    > = {},
  ) => {
    return useQuery<AxiosResponse<Activity>, AxiosError<ApiError>>({
      queryKey: ["activities", { activityId, ...queryParams }],
      queryFn: () =>
        authFetch!.get(`activities/${activityId}`, { params: queryParams }),
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
    number[],
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

  const redoActivitiesQuery = useMutation<
    number[],
    AxiosError<ApiError>,
    RedoUndoActivitiesParams
  >({
    mutationFn: (params) => authFetch!.post("activities/reapply", params),
    onSuccess: () => queryClient.invalidateQueries(["activities"]),
  });

  const undoActivitiesQuery = useMutation<
    number[],
    AxiosError<ApiError>,
    RedoUndoActivitiesParams
  >({
    mutationFn: (params) => authFetch!.post("activities/revert", params),
    onSuccess: () => queryClient.invalidateQueries(["activities"]),
  });

  const openActivityDetails = (activity: ActivityCommon) => {
    setSidePanelContent(
      activity.summary,
      <Suspense fallback={<LoadingState />}>
        <ActivityDetails activityId={activity.id} />
      </Suspense>,
    );
  };

  return {
    getActivitiesQuery,
    getSingleActivityQuery,
    getActivityTypesQuery,
    cancelActivitiesQuery,
    approveActivitiesQuery,
    redoActivitiesQuery,
    undoActivitiesQuery,
    openActivityDetails,
  };
}
