import type { AxiosError, AxiosResponse } from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Activity } from "@/features/activities";
import useFetch from "@/hooks/useFetch";
import useFetchOld from "@/hooks/useFetchOld";
import type { ApiError } from "@/types/api/ApiError";
import type { ApiPaginatedResponse } from "@/types/api/ApiPaginatedResponse";
import type { Instance } from "@/types/Instance";
import type { QueryFnType } from "@/types/api/QueryFnType";

interface GetWslParams {
  limit?: number;
  offset?: number;
}

interface CreateChildInstanceParams {
  computer_name: string;
  parent_id: number;
  rootfs_url?: string;
  cloud_init?: string;
}

interface SetDefaultChildInstanceParams {
  child_id: number;
  parent_id: number;
}

interface ShutdownHostInstanceParams {
  parent_id: number;
}

interface ChildInstancesActionsParams {
  computer_ids: number[];
}

export interface WslInstanceName {
  label: string;
  name: string;
}

export const useWsl = () => {
  const queryClient = useQueryClient();
  const authFetchOld = useFetchOld();
  const authFetch = useFetch();

  const getWslHostsQuery: QueryFnType<
    AxiosResponse<ApiPaginatedResponse<Instance>>,
    GetWslParams
  > = (queryParams = {}, config = {}) => {
    return useQuery<
      AxiosResponse<ApiPaginatedResponse<Instance>>,
      AxiosError<ApiError>
    >({
      queryKey: ["wsl", queryParams],
      queryFn: async () =>
        authFetch.get("computers/wsl-hosts", {
          params: queryParams,
        }),
      ...config,
    });
  };

  const createChildInstanceQuery = useMutation<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    CreateChildInstanceParams
  >({
    mutationFn: async ({ parent_id, ...params }) =>
      authFetch.post(`computers/${parent_id}/children`, params),
    onSuccess: async () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["wsl-hosts"] }),
        queryClient.invalidateQueries({ queryKey: ["instances"] }),
      ]),
  });

  const deleteChildInstancesQuery = useMutation<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    ChildInstancesActionsParams
  >({
    mutationFn: async (params) =>
      authFetchOld.get("DeleteChildComputers", { params }),
    onSuccess: async () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["wsl-hosts"] }),
        queryClient.invalidateQueries({ queryKey: ["instances"] }),
      ]),
  });

  const setDefaultChildInstanceQuery = useMutation<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    SetDefaultChildInstanceParams
  >({
    mutationFn: async (params) =>
      authFetchOld.get("SetDefaultChildComputer", { params }),
    onSuccess: async () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["wsl-hosts"] }),
        queryClient.invalidateQueries({ queryKey: ["instances"] }),
      ]),
  });

  const shutdownHostInstanceQuery = useMutation<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    ShutdownHostInstanceParams
  >({
    mutationFn: async (params) =>
      authFetchOld.get("ShutdownHostComputer", { params }),
    onSuccess: async () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["wsl-hosts"] }),
        queryClient.invalidateQueries({ queryKey: ["instances"] }),
      ]),
  });

  const startChildInstancesQuery = useMutation<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    ChildInstancesActionsParams
  >({
    mutationFn: async (params) =>
      authFetchOld.get("StartChildComputers", { params }),
    onSuccess: async () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["wsl-hosts"] }),
        queryClient.invalidateQueries({ queryKey: ["instances"] }),
      ]),
  });

  const stopChildInstancesQuery = useMutation<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    ChildInstancesActionsParams
  >({
    mutationFn: async (params) =>
      authFetchOld.get("StopChildComputers", { params }),
    onSuccess: async () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["wsl-hosts"] }),
        queryClient.invalidateQueries({ queryKey: ["instances"] }),
      ]),
  });

  const getWslInstanceNamesQuery: QueryFnType<
    AxiosResponse<WslInstanceName[]>,
    undefined
  > = (_, config = {}) => {
    return useQuery<AxiosResponse<WslInstanceName[]>, AxiosError<ApiError>>({
      queryKey: ["wsl-instance-names"],
      queryFn: async () => authFetch.get("wsl-instance-names"),
      ...config,
    });
  };

  return {
    createChildInstanceQuery,
    deleteChildInstancesQuery,
    getWslInstanceNamesQuery,
    getWslHostsQuery,
    setDefaultChildInstanceQuery,
    shutdownHostInstanceQuery,
    startChildInstancesQuery,
    stopChildInstancesQuery,
  };
};
