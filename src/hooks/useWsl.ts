import { QueryFnType } from "../types/QueryFnType";
import { Computer } from "../types/Computer";
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

export interface CreateChildComputerParams {
  parent_id: number;
  computer_name: string;
}

interface SetDefaultChildComputerParams {
  parent_id: number;
  child_id: number;
}

interface ShutdownHostComputerParams {
  parent_id: number;
}

interface ChildComputersActionsParams {
  computer_ids: number[];
}

export const useWsl = () => {
  const queryClient = useQueryClient();
  const authFetchOld = useFetchOld();
  const authFetch = useFetch();

  const getWslHostsQuery: QueryFnType<
    AxiosResponse<ApiPaginatedResponse<Computer>>,
    GetWslParams
  > = (queryParams = {}, config = {}) => {
    return useQuery<
      AxiosResponse<ApiPaginatedResponse<Computer>>,
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

  const createChildComputerQuery = useMutation<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    CreateChildComputerParams
  >({
    mutationFn: (params) =>
      authFetchOld!.get("CreateChildComputer", { params }),
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries(["wsl-hosts"]),
        queryClient.invalidateQueries(["computers"]),
      ]),
  });

  const deleteChildComputersQuery = useMutation<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    ChildComputersActionsParams
  >({
    mutationFn: (params) =>
      authFetchOld!.get("DeleteChildComputers", { params }),
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries(["wsl-hosts"]),
        queryClient.invalidateQueries(["computers"]),
      ]),
  });

  const setDefaultChildComputerQuery = useMutation<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    SetDefaultChildComputerParams
  >({
    mutationFn: (params) =>
      authFetchOld!.get("SetDefaultChildComputer", { params }),
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries(["wsl-hosts"]),
        queryClient.invalidateQueries(["computers"]),
      ]),
  });

  const shutdownHostComputerQuery = useMutation<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    ShutdownHostComputerParams
  >({
    mutationFn: (params) =>
      authFetchOld!.get("ShutdownHostComputer", { params }),
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries(["wsl-hosts"]),
        queryClient.invalidateQueries(["computers"]),
      ]),
  });

  const startChildComputersQuery = useMutation<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    ChildComputersActionsParams
  >({
    mutationFn: (params) =>
      authFetchOld!.get("StartChildComputers", { params }),
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries(["wsl-hosts"]),
        queryClient.invalidateQueries(["computers"]),
      ]),
  });

  const stopChildComputersQuery = useMutation<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    ChildComputersActionsParams
  >({
    mutationFn: (params) => authFetchOld!.get("StopChildComputers", { params }),
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries(["wsl-hosts"]),
        queryClient.invalidateQueries(["computers"]),
      ]),
  });

  return {
    createChildComputerQuery,
    deleteChildComputersQuery,
    getWslHostsQuery,
    setDefaultChildComputerQuery,
    shutdownHostComputerQuery,
    startChildComputersQuery,
    stopChildComputersQuery,
  };
};
