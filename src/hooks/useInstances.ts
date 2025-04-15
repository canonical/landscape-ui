import type { AxiosError, AxiosResponse } from "axios";
import type { UseQueryOptions } from "@tanstack/react-query";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Activity } from "@/features/activities";
import type { ApiError } from "@/types/api/ApiError";
import type { ApiPaginatedResponse } from "@/types/api/ApiPaginatedResponse";
import type { Instance, PendingInstance } from "@/types/Instance";
import type { QueryFnType } from "@/types/QueryFnType";
import useFetch from "./useFetch";
import useFetchOld from "./useFetchOld";

export interface GetInstancesParams {
  query?: string;
  limit?: number;
  offset?: number;
  with_network?: boolean;
  with_hardware?: boolean;
  with_grouped_hardware?: boolean;
  with_annotations?: boolean;
  root_only?: boolean;
  wsl_only?: boolean;
  with_alerts?: boolean;
  with_upgrades?: boolean;
}

interface GetSingleInstanceParams {
  instanceId: number;
  with_annotations?: boolean;
  with_grouped_hardware?: boolean;
  with_hardware?: boolean;
  with_network?: boolean;
}

interface EditInstanceParams {
  instanceId: number;
  access_group?: string;
  comment?: string;
  tags?: string[];
  title?: string;
}

interface AddAnnotationToInstancesParams {
  query: string;
  key: string;
  value?: string;
}

interface RemoveAnnotationFromInstancesParams {
  query: string;
  key: string;
}

interface AddTagsToInstancesParams {
  query: string;
  tags: string[];
}

interface RemoveTagsFromInstancesParams {
  query: string;
  tags: string[];
}

interface ChangeInstancesAccessGroupParams {
  query: string;
  access_group: string;
}

export interface RemoveInstances {
  computer_ids: number[];
}

interface AcceptPendingInstancesParams {
  computer_ids: number[];
  access_group?: string;
}

interface RejectPendingInstancesParams {
  computer_ids: number[];
}

interface CreateCloudOtpsParams {
  count: number;
}

interface InstancesPowerManageParams {
  computer_ids: number[];
  // `YYYY-MM-DDTHH:MM:SSZ`
  deliver_after?: string;
}

interface RestartInstanceParams {
  id: number;
  deliver_after?: string;
  deliver_delay_window?: number;
}

interface RenameInstancesParams {
  // `"<instance_id>:<new_title>"[]`
  computer_titles: string[];
}

export interface SanitizeInstancesParams {
  computer_id: number;
  computer_title: string;
}

export default function useInstances() {
  const queryClient = useQueryClient();
  const authFetchOld = useFetchOld();
  const authFetch = useFetch();

  const getInstancesQuery: QueryFnType<
    AxiosResponse<ApiPaginatedResponse<Instance>>,
    GetInstancesParams
  > = (queryParams = {}, config = {}) =>
    useQuery<
      AxiosResponse<ApiPaginatedResponse<Instance>>,
      AxiosError<ApiError>
    >({
      queryKey: ["instances", queryParams],
      queryFn: async () => authFetch.get("computers", { params: queryParams }),
      ...config,
    });

  const getSingleInstanceQuery = (
    { instanceId, ...queryParams }: GetSingleInstanceParams,
    config: Omit<
      UseQueryOptions<AxiosResponse<Instance>, AxiosError<ApiError>>,
      "queryKey" | "queryFn"
    > = {},
  ) =>
    useQuery<AxiosResponse<Instance>, AxiosError<ApiError>>({
      queryKey: ["instances", instanceId, queryParams],
      queryFn: async () =>
        authFetch.get(`computers/${instanceId}`, { params: queryParams }),
      ...config,
    });

  const editInstanceQuery = useMutation<
    AxiosResponse<Instance>,
    AxiosError<ApiError>,
    EditInstanceParams
  >({
    mutationFn: async ({ instanceId, ...params }) =>
      authFetch.put(`computers/${instanceId}`, params),
    onSuccess: async () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["instances"] }),
        queryClient.invalidateQueries({ queryKey: ["instanceTags"] }),
      ]),
  });

  const addAnnotationToInstancesQuery = useMutation<
    AxiosResponse<Instance[]>,
    AxiosError<ApiError>,
    AddAnnotationToInstancesParams
  >({
    mutationFn: async (params) =>
      authFetchOld.get("AddAnnotationToComputers", { params }),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["instances"] }),
  });

  const removeAnnotationFromInstancesQuery = useMutation<
    AxiosResponse<Instance[]>,
    AxiosError<ApiError>,
    RemoveAnnotationFromInstancesParams
  >({
    mutationFn: async (params) =>
      authFetchOld.get("RemoveAnnotationFromComputers", { params }),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["instances"] }),
  });

  const addTagsToInstancesQuery = useMutation<
    AxiosResponse<Instance[]>,
    AxiosError<ApiError>,
    AddTagsToInstancesParams
  >({
    mutationFn: async (params) =>
      authFetchOld.get("AddTagsToComputers", { params }),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["instances"] }),
  });

  const removeTagsFromInstancesQuery = useMutation<
    AxiosResponse<Instance[]>,
    AxiosError<ApiError>,
    RemoveTagsFromInstancesParams
  >({
    mutationFn: async (params) =>
      authFetchOld.get("RemoveTagsFromComputers", { params }),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["instances"] }),
  });

  const changeInstancesAccessGroupQuery = useMutation<
    AxiosResponse<Instance[]>,
    AxiosError<ApiError>,
    ChangeInstancesAccessGroupParams
  >({
    mutationFn: async (params) =>
      authFetchOld.get("ChangeComputersAccessGroup", { params }),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["instances"] }),
  });

  const removeInstancesQuery = useMutation<
    AxiosResponse<Instance[]>,
    AxiosError<ApiError>,
    RemoveInstances
  >({
    mutationFn: async (params) =>
      authFetchOld.get("RemoveComputers", { params }),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["instances"] }),
  });

  const getPendingInstancesQuery: QueryFnType<
    AxiosResponse<PendingInstance[]>,
    Record<never, unknown>
  > = (queryParams = {}, config = {}) =>
    useQuery<AxiosResponse<PendingInstance[]>, AxiosError<ApiError>>({
      queryKey: ["pendingInstances"],
      queryFn: async () =>
        authFetchOld.get("GetPendingComputers", { params: queryParams }),
      ...config,
    });

  const acceptPendingInstancesQuery = useMutation<
    AxiosResponse<PendingInstance[]>,
    AxiosError<ApiError>,
    AcceptPendingInstancesParams
  >({
    mutationFn: async (params) =>
      authFetchOld.get("AcceptPendingComputers", { params }),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["pendingInstances"] }),
  });

  const rejectPendingInstancesQuery = useMutation<
    AxiosResponse<PendingInstance[]>,
    AxiosError<ApiError>,
    RejectPendingInstancesParams
  >({
    mutationFn: async (params) =>
      authFetchOld.get("RejectPendingComputers", { params }),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["pendingInstances"] }),
  });

  const createCloudOtpsQuery = useMutation<
    AxiosResponse<string[]>,
    AxiosError<ApiError>,
    CreateCloudOtpsParams
  >({
    mutationFn: async (params) =>
      authFetchOld.get("CreateCloudOtps", { params }),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["instances"] }),
  });

  const rebootInstancesQuery = useMutation<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    InstancesPowerManageParams
  >({
    mutationFn: async (params) =>
      authFetchOld.get("RebootComputers", { params }),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["instances"] }),
  });

  const restartInstanceQuery = useMutation<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    RestartInstanceParams
  >({
    mutationFn: async ({ id, ...queryParams }) =>
      authFetch.post(`computers/${id}/restart`, queryParams),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["instances"] }),
  });

  const shutdownInstancesQuery = useMutation<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    InstancesPowerManageParams
  >({
    mutationFn: async (params) =>
      authFetchOld.get("ShutdownComputers", { params }),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["instances"] }),
  });

  const renameInstancesQuery = useMutation<
    AxiosResponse<Instance[]>,
    AxiosError<ApiError>,
    RenameInstancesParams
  >({
    mutationFn: async (params) =>
      authFetchOld.get("RenameComputers", { params }),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["instances"] }),
  });

  const getAllInstanceTagsQuery: QueryFnType<
    AxiosResponse<ApiPaginatedResponse<string>>,
    Record<never, unknown>
  > = (queryParams = {}, config = {}) =>
    useQuery<AxiosResponse<ApiPaginatedResponse<string>>, AxiosError<ApiError>>(
      {
        queryKey: ["instanceTags"],
        queryFn: async () => authFetch.get("tags", { params: queryParams }),
        ...config,
      },
    );

  const getAvailabilityZonesQuery: QueryFnType<
    AxiosResponse<{ values: string[] }>,
    Record<never, unknown>
  > = (queryParams = {}, config = {}) =>
    useQuery({
      queryKey: ["availabilityZones"],
      queryFn: async () =>
        authFetch.get<{ values: string[] }>("computers/availability-zones", {
          params: queryParams,
        }),
      ...config,
    });

  const sanitizeInstanceQuery = useMutation<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    SanitizeInstancesParams
  >({
    mutationKey: ["instance", "sanitize"],
    mutationFn: async ({ computer_id, ...params }) =>
      authFetch.post(`computers/${computer_id}/sanitize`, params),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["instances"] }),
  });

  return {
    getInstancesQuery,
    getSingleInstanceQuery,
    editInstanceQuery,
    addAnnotationToInstancesQuery,
    removeAnnotationFromInstancesQuery,
    addTagsToInstancesQuery,
    removeTagsFromInstancesQuery,
    changeInstancesAccessGroupQuery,
    removeInstancesQuery,
    getPendingInstancesQuery,
    acceptPendingInstancesQuery,
    rejectPendingInstancesQuery,
    createCloudOtpsQuery,
    rebootInstancesQuery,
    restartInstanceQuery,
    shutdownInstancesQuery,
    renameInstancesQuery,
    getAllInstanceTagsQuery,
    getAvailabilityZonesQuery,
    sanitizeInstanceQuery,
  };
}
