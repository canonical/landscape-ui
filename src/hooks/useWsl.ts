import { QueryFnType } from "../types/QueryFnType";
import { Instance } from "../types/Instance";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { ApiError } from "../types/ApiError";
import { ApiPaginatedResponse } from "../types/ApiPaginatedResponse";
import useFetch from "./useFetch";
import useFetchOld from "./useFetchOld";
import { Activity } from "../types/Activity";

interface GetWslParams {
  limit?: number;
  offset?: number;
}

export interface CreateChildInstanceParams {
  computer_name: string;
  parent_id: number;
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

interface WslInstanceName {
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
      queryFn: () =>
        authFetch!.get("computers/wsl-hosts", {
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
    mutationFn: (params) =>
      authFetchOld!.get("CreateChildComputer", { params }),
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries(["wsl-hosts"]),
        queryClient.invalidateQueries(["instances"]),
      ]),
  });

  const deleteChildInstancesQuery = useMutation<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    ChildInstancesActionsParams
  >({
    mutationFn: (params) =>
      authFetchOld!.get("DeleteChildComputers", { params }),
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries(["wsl-hosts"]),
        queryClient.invalidateQueries(["instances"]),
      ]),
  });

  const setDefaultChildInstanceQuery = useMutation<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    SetDefaultChildInstanceParams
  >({
    mutationFn: (params) =>
      authFetchOld!.get("SetDefaultChildComputer", { params }),
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries(["wsl-hosts"]),
        queryClient.invalidateQueries(["instances"]),
      ]),
  });

  const shutdownHostInstanceQuery = useMutation<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    ShutdownHostInstanceParams
  >({
    mutationFn: (params) =>
      authFetchOld!.get("ShutdownHostComputer", { params }),
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries(["wsl-hosts"]),
        queryClient.invalidateQueries(["instances"]),
      ]),
  });

  const startChildInstancesQuery = useMutation<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    ChildInstancesActionsParams
  >({
    mutationFn: (params) =>
      authFetchOld!.get("StartChildComputers", { params }),
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries(["wsl-hosts"]),
        queryClient.invalidateQueries(["instances"]),
      ]),
  });

  const stopChildInstancesQuery = useMutation<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    ChildInstancesActionsParams
  >({
    mutationFn: (params) => authFetchOld!.get("StopChildComputers", { params }),
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries(["wsl-hosts"]),
        queryClient.invalidateQueries(["instances"]),
      ]),
  });

  const getWslInstanceNamesQuery: QueryFnType<
    AxiosResponse<WslInstanceName[]>,
    undefined
  > = (_, config = {}) => {
    return useQuery<AxiosResponse<WslInstanceName[]>, AxiosError<ApiError>>({
      queryKey: ["wsl-instance-names"],
      queryFn: () => authFetch!.get("wsl-instance-names"),
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
