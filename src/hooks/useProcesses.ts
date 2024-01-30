import useFetch from "./useFetch";
import { QueryFnType } from "../types/QueryFnType";
import { AxiosError, AxiosResponse } from "axios";
import { ApiPaginatedResponse } from "../types/ApiPaginatedResponse";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ApiError } from "../types/ApiError";
import { Activity } from "../types/Activity";
import { Process } from "../types/Process";

interface GetProcessesParams {
  query?: string;
  limit?: number;
  offset?: number;
}

interface ProcessesSignalParams {
  computer_id: number;
  pids: number[];
}

export const useProcesses = () => {
  const AuthFetch = useFetch();

  const getProcessesQuery: QueryFnType<
    AxiosResponse<ApiPaginatedResponse<Process>>,
    GetProcessesParams
  > = (queryParams = {}, config = {}) => {
    return useQuery<
      AxiosResponse<ApiPaginatedResponse<Process>>,
      AxiosError<ApiError>
    >({
      queryKey: ["processes", queryParams],
      queryFn: () =>
        AuthFetch!.get("processes", {
          params: queryParams,
        }),
      ...config,
    });
  };

  const terminateProcessQuery = useMutation<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    ProcessesSignalParams
  >({
    mutationFn: (params) => AuthFetch!.post(`processes/terminate`, params),
  });

  const killProcessQuery = useMutation<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    ProcessesSignalParams
  >({
    mutationFn: (params) => AuthFetch!.post(`processes/kill`, params),
  });

  return { getProcessesQuery, killProcessQuery, terminateProcessQuery };
};
