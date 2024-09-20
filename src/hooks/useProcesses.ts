import useFetch from "./useFetch";
import { QueryFnType } from "@/types/QueryFnType";
import { AxiosError, AxiosResponse } from "axios";
import { ApiPaginatedResponse } from "@/types/ApiPaginatedResponse";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiError } from "@/types/ApiError";
import { Activity } from "@/features/activities";
import { Process } from "@/types/Process";

export interface GetProcessesParams {
  computer_id: number;
  limit?: number;
  offset?: number;
  search?: string;
}

interface ProcessesSignalParams {
  computer_id: number;
  pids: number[];
}

export const useProcesses = () => {
  const authFetch = useFetch();
  const queryClient = useQueryClient();

  const getProcessesQuery: QueryFnType<
    AxiosResponse<ApiPaginatedResponse<Process>>,
    GetProcessesParams
  > = (queryParams, config = {}) => {
    const { computer_id, ...params } = queryParams!;
    return useQuery<
      AxiosResponse<ApiPaginatedResponse<Process>>,
      AxiosError<ApiError>
    >({
      queryKey: ["processes", queryParams],
      queryFn: () =>
        authFetch!.get(`/computers/${computer_id}/processes`, { params }),
      ...config,
    });
  };

  const terminateProcessQuery = useMutation<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    ProcessesSignalParams
  >({
    mutationFn: (params) => authFetch!.post("processes/terminate", params),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["processes"] }),
  });

  const killProcessQuery = useMutation<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    ProcessesSignalParams
  >({
    mutationFn: (params) => authFetch!.post("processes/kill", params),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["processes"] }),
  });

  return { getProcessesQuery, killProcessQuery, terminateProcessQuery };
};
