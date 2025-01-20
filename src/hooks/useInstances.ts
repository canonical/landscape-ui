import type { AxiosError, AxiosResponse } from "axios";
import type { UseQueryOptions } from "@tanstack/react-query";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Activity } from "@/features/activities";
import type { ApiError } from "@/types/ApiError";
import type { ApiPaginatedResponse } from "@/types/ApiPaginatedResponse";
import type { Instance, PendingInstance } from "@/types/Instance";
import type { QueryFnType } from "@/types/QueryFnType";
import useFetch from "./useFetch";
import useFetchOld from "./useFetchOld";
import { instances } from "@/tests/mocks/instance";

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

interface GetEmployeeInstancesParams {
  employeeId: number;
  with_provisioning_info: true;
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

interface RemoveInstances {
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
      queryFn: () => authFetch.get("computers", { params: queryParams }),
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
      queryKey: ["instances", { instanceId, ...queryParams }],
      queryFn: () =>
        authFetch.get(`computers/${instanceId}`, { params: queryParams }),
      ...config,
    });

  const getEmployeeInstancesQuery = (
    { employeeId, ...queryParams }: GetEmployeeInstancesParams,
    config: Omit<
      UseQueryOptions<AxiosResponse<Instance[]>, AxiosError<ApiError>>,
      "queryKey" | "queryFn"
    > = {}, //TODO change the return type to the truncated version
  ) =>
    useQuery<AxiosResponse<Instance[]>, AxiosError<ApiError>>({
      queryKey: ["instances", { employeeId, ...queryParams }],
      // queryFn: () =>
      //   authFetch.get(`computers/${employeeId}`, { params: queryParams }),
      queryFn: () =>
        new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              data: instances.slice(0, 5),
              status: 200,
              statusText: "OK",
              headers: {},
              config: {},
            } as AxiosResponse<Instance[]>);
          }, 200); // Simulate delay
        }),
      ...config,
    });

  const editInstanceQuery = useMutation<
    AxiosResponse<Instance>,
    AxiosError<ApiError>,
    EditInstanceParams
  >({
    mutationFn: ({ instanceId, ...params }) =>
      authFetch.put(`computers/${instanceId}`, params),
    onSuccess: () =>
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
    mutationFn: (params) =>
      authFetchOld.get("AddAnnotationToComputers", { params }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["instances"] }),
  });

  const removeAnnotationFromInstancesQuery = useMutation<
    AxiosResponse<Instance[]>,
    AxiosError<ApiError>,
    RemoveAnnotationFromInstancesParams
  >({
    mutationFn: (params) =>
      authFetchOld.get("RemoveAnnotationFromComputers", { params }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["instances"] }),
  });

  const addTagsToInstancesQuery = useMutation<
    AxiosResponse<Instance[]>,
    AxiosError<ApiError>,
    AddTagsToInstancesParams
  >({
    mutationFn: (params) => authFetchOld.get("AddTagsToComputers", { params }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["instances"] }),
  });

  const removeTagsFromInstancesQuery = useMutation<
    AxiosResponse<Instance[]>,
    AxiosError<ApiError>,
    RemoveTagsFromInstancesParams
  >({
    mutationFn: (params) =>
      authFetchOld.get("RemoveTagsFromComputers", { params }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["instances"] }),
  });

  const changeInstancesAccessGroupQuery = useMutation<
    AxiosResponse<Instance[]>,
    AxiosError<ApiError>,
    ChangeInstancesAccessGroupParams
  >({
    mutationFn: (params) =>
      authFetchOld.get("ChangeComputersAccessGroup", { params }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["instances"] }),
  });

  const removeInstancesQuery = useMutation<
    AxiosResponse<Instance[]>,
    AxiosError<ApiError>,
    RemoveInstances
  >({
    mutationFn: (params) => authFetchOld.get("RemoveComputers", { params }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["instances"] }),
  });

  const getPendingInstancesQuery: QueryFnType<
    AxiosResponse<PendingInstance[]>,
    Record<never, unknown>
  > = (queryParams = {}, config = {}) =>
    useQuery<AxiosResponse<PendingInstance[]>, AxiosError<ApiError>>({
      queryKey: ["pendingInstances"],
      queryFn: () =>
        authFetchOld.get("GetPendingComputers", { params: queryParams }),
      ...config,
    });

  const acceptPendingInstancesQuery = useMutation<
    AxiosResponse<PendingInstance[]>,
    AxiosError<ApiError>,
    AcceptPendingInstancesParams
  >({
    mutationFn: (params) =>
      authFetchOld.get("AcceptPendingComputers", { params }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["pendingInstances"] }),
  });

  const rejectPendingInstancesQuery = useMutation<
    AxiosResponse<PendingInstance[]>,
    AxiosError<ApiError>,
    RejectPendingInstancesParams
  >({
    mutationFn: (params) =>
      authFetchOld.get("RejectPendingComputers", { params }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["pendingInstances"] }),
  });

  const createCloudOtpsQuery = useMutation<
    AxiosResponse<string[]>,
    AxiosError<ApiError>,
    CreateCloudOtpsParams
  >({
    mutationFn: (params) => authFetchOld.get("CreateCloudOtps", { params }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["instances"] }),
  });

  const rebootInstancesQuery = useMutation<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    InstancesPowerManageParams
  >({
    mutationFn: (params) => authFetchOld.get("RebootComputers", { params }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["instances"] }),
  });

  const restartInstanceQuery = useMutation<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    RestartInstanceParams
  >({
    mutationFn: ({ id, ...queryParams }) =>
      authFetch.post(`computers/${id}/restart`, queryParams),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["instances"] }),
  });

  const shutdownInstancesQuery = useMutation<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    InstancesPowerManageParams
  >({
    mutationFn: (params) => authFetchOld.get("ShutdownComputers", { params }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["instances"] }),
  });

  const renameInstancesQuery = useMutation<
    AxiosResponse<Instance[]>,
    AxiosError<ApiError>,
    RenameInstancesParams
  >({
    mutationFn: (params) => authFetchOld.get("RenameComputers", { params }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["instances"] }),
  });

  const getAllInstanceTagsQuery: QueryFnType<
    AxiosResponse<ApiPaginatedResponse<string>>,
    Record<never, unknown>
  > = (queryParams = {}, config = {}) =>
    useQuery<AxiosResponse<ApiPaginatedResponse<string>>, AxiosError<ApiError>>(
      {
        queryKey: ["instanceTags"],
        queryFn: () => authFetch.get("tags", { params: queryParams }),
        ...config,
      },
    );

  const getAvailabilityZonesQuery: QueryFnType<
    AxiosResponse<{ values: string[] }>,
    Record<never, unknown>
  > = (queryParams = {}, config = {}) =>
    useQuery({
      queryKey: ["availabilityZones"],
      queryFn: () =>
        authFetch.get<{ values: string[] }>("computers/availability-zones", {
          params: queryParams,
        }),
      ...config,
    });

  return {
    getInstancesQuery,
    getSingleInstanceQuery,
    getEmployeeInstancesQuery,
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
  };
}
