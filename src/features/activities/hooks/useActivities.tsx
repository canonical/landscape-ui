import LoadingState from "@/components/layout/LoadingState";
import useFetch from "@/hooks/useFetch";
import useFetchOld from "@/hooks/useFetchOld";
import useSidePanel from "@/hooks/useSidePanel";
import type { ApiError } from "@/types/ApiError";
import type { ApiPaginatedResponse } from "@/types/ApiPaginatedResponse";
import type { QueryFnType } from "@/types/QueryFnType";
import type { UseQueryOptions } from "@tanstack/react-query";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import { lazy, Suspense } from "react";
import type {
  Activity,
  ActivityCommon,
  ApproveActivitiesParams,
  CancelActivitiesParams,
  GetActivitiesParams,
  GetSingleActivityParams,
  RedoUndoActivitiesParams,
} from "../types";

const ActivityDetails = lazy(
  async () => import("../components/ActivityDetails"),
);

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
      queryFn: async () =>
        authFetch.get("activities", {
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
      queryFn: async () =>
        authFetch.get(`activities/${activityId}`, { params: queryParams }),
      ...config,
    });
  };

  const getActivityTypesQuery: QueryFnType<
    AxiosResponse<string[]>,
    Record<never, unknown>
  > = (queryParams = {}, config = {}) => {
    return useQuery<AxiosResponse<string[]>, AxiosError<ApiError>>({
      queryKey: ["activityTypes"],
      queryFn: async () =>
        authFetchOld.get("GetActivityTypes", { params: queryParams }),
      ...config,
    });
  };

  const cancelActivitiesQuery = useMutation<
    number[],
    AxiosError<ApiError>,
    CancelActivitiesParams
  >({
    mutationKey: ["activities", "cancel"],
    mutationFn: async (params) =>
      authFetchOld.get("CancelActivities", { params }),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["activities"] }),
  });

  const approveActivitiesQuery = useMutation<
    string[],
    AxiosError<ApiError>,
    ApproveActivitiesParams
  >({
    mutationKey: ["activities", "approve"],
    mutationFn: async (params) =>
      authFetchOld.get("ApproveActivities", { params }),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["activities"] }),
  });

  const redoActivitiesQuery = useMutation<
    number[],
    AxiosError<ApiError>,
    RedoUndoActivitiesParams
  >({
    mutationFn: async (params) => authFetch.post("activities/reapply", params),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["activities"] }),
  });

  const undoActivitiesQuery = useMutation<
    number[],
    AxiosError<ApiError>,
    RedoUndoActivitiesParams
  >({
    mutationFn: async (params) => authFetch.post("activities/revert", params),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["activities"] }),
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
