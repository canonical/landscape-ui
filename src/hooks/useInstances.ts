import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useFetchOld from "./useFetchOld";
import { QueryFnType } from "@/types/QueryFnType";
import { AxiosError, AxiosResponse } from "axios";
import { Instance } from "@/types/Instance";
import { ApiError } from "@/types/ApiError";
import { Activity } from "@/types/Activity";
import useFetch from "./useFetch";
import { ApiPaginatedResponse } from "@/types/ApiPaginatedResponse";

interface GetInstancesParams {
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
      queryFn: () =>
        authFetch!.get("computers", {
          params: queryParams,
        }),
      ...config,
    });

  const addAnnotationToInstancesQuery = useMutation<
    AxiosResponse<Instance[]>,
    AxiosError<ApiError>,
    AddAnnotationToInstancesParams
  >({
    mutationFn: (params) =>
      authFetchOld!.get("AddAnnotationToComputers", { params }),
    onSuccess: () => queryClient.invalidateQueries(["instances"]),
  });

  const removeAnnotationFromInstancesQuery = useMutation<
    AxiosResponse<Instance[]>,
    AxiosError<ApiError>,
    RemoveAnnotationFromInstancesParams
  >({
    mutationFn: (params) =>
      authFetchOld!.get("RemoveAnnotationFromComputers", { params }),
    onSuccess: () => queryClient.invalidateQueries(["instances"]),
  });

  const addTagsToInstancesQuery = useMutation<
    AxiosResponse<Instance[]>,
    AxiosError<ApiError>,
    AddTagsToInstancesParams
  >({
    mutationFn: (params) => authFetchOld!.get("AddTagsToComputers", { params }),
    onSuccess: () => queryClient.invalidateQueries(["instances"]),
  });

  const removeTagsFromInstancesQuery = useMutation<
    AxiosResponse<Instance[]>,
    AxiosError<ApiError>,
    RemoveTagsFromInstancesParams
  >({
    mutationFn: (params) =>
      authFetchOld!.get("RemoveTagsFromComputers", { params }),
    onSuccess: () => queryClient.invalidateQueries(["instances"]),
  });

  const changeInstancesAccessGroupQuery = useMutation<
    AxiosResponse<Instance[]>,
    AxiosError<ApiError>,
    ChangeInstancesAccessGroupParams
  >({
    mutationFn: (params) =>
      authFetchOld!.get("ChangeComputersAccessGroup", { params }),
    onSuccess: () => queryClient.invalidateQueries(["instances"]),
  });

  const removeInstancesQuery = useMutation<
    AxiosResponse<Instance[]>,
    AxiosError<ApiError>,
    RemoveInstances
  >({
    mutationFn: (params) => authFetchOld!.get("RemoveComputers", { params }),
    onSuccess: () => queryClient.invalidateQueries(["instances"]),
  });

  const getPendingInstancesQuery: QueryFnType<
    AxiosResponse<Instance[]>,
    undefined
  > = (_, config = {}) =>
    useQuery<AxiosResponse<Instance[]>, AxiosError<ApiError>>({
      queryKey: ["instances", "pending"],
      queryFn: () => authFetchOld!.get("GetPendingComputers"),
      ...config,
    });

  const acceptPendingInstancesQuery = useMutation<
    AxiosResponse<Instance[]>,
    AxiosError<ApiError>,
    AcceptPendingInstancesParams
  >({
    mutationFn: (params) =>
      authFetchOld!.get("AcceptPendingComputers", { params }),
    onSuccess: () => queryClient.invalidateQueries(["instances"]),
  });

  const rejectPendingInstancesQuery = useMutation<
    AxiosResponse<Instance[]>,
    AxiosError<ApiError>,
    RejectPendingInstancesParams
  >({
    mutationFn: (params) =>
      authFetchOld!.get("RejectPendingComputers", { params }),
    onSuccess: () => queryClient.invalidateQueries(["instances"]),
  });

  const createCloudOtpsQuery = useMutation<
    AxiosResponse<string[]>,
    AxiosError<ApiError>,
    CreateCloudOtpsParams
  >({
    mutationFn: (params) => authFetchOld!.get("CreateCloudOtps", { params }),
    onSuccess: () => queryClient.invalidateQueries(["instances"]),
  });

  const rebootInstancesQuery = useMutation<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    InstancesPowerManageParams
  >({
    mutationFn: (params) => authFetchOld!.get("RebootComputers", { params }),
    onSuccess: () => queryClient.invalidateQueries(["instances"]),
  });

  const shutdownInstancesQuery = useMutation<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    InstancesPowerManageParams
  >({
    mutationFn: (params) => authFetchOld!.get("ShutdownComputers", { params }),
    onSuccess: () => queryClient.invalidateQueries(["instances"]),
  });

  const renameInstancesQuery = useMutation<
    AxiosResponse<Instance[]>,
    AxiosError<ApiError>,
    RenameInstancesParams
  >({
    mutationFn: (params) => authFetchOld!.get("RenameComputers", { params }),
    onSuccess: () => queryClient.invalidateQueries(["instances"]),
  });

  return {
    getInstancesQuery,
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
    shutdownInstancesQuery,
    renameInstancesQuery,
  };
}
