import useFetch from "@/hooks/useFetch";
import type { QueryFnType } from "@/types/api/QueryFnType";
import type { AxiosError, AxiosResponse } from "axios";
import type { ApiPaginatedResponse } from "@/types/api/ApiPaginatedResponse";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ApiError } from "@/types/api/ApiError";
import type { Activity } from "@/features/activities";
import type {
  GetProcessesParams,
  Process,
  ProcessesSignalParams,
} from "../types";

export default function useProcesses() {
  const authFetch = useFetch();
  const queryClient = useQueryClient();

  const getProcessesQuery: QueryFnType<
    AxiosResponse<ApiPaginatedResponse<Process>>,
    GetProcessesParams
  > = (queryParams, config = {}) => {
    if (!queryParams) {
      throw new Error("Missing required parameters");
    }

    const { computer_id, ...rest } = queryParams;
    const params = { ...rest, search: rest.search || undefined };
    return useQuery<
      AxiosResponse<ApiPaginatedResponse<Process>>,
      AxiosError<ApiError>
    >({
      queryKey: ["processes", { computer_id, ...params }],
      queryFn: async () =>
        authFetch.get(`/computers/${computer_id}/processes`, { params }),
      ...config,
    });
  };

  const terminateProcessQuery = useMutation<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    ProcessesSignalParams
  >({
    mutationFn: async (params) => authFetch.post("processes/terminate", params),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["processes"] }),
  });

  const killProcessQuery = useMutation<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    ProcessesSignalParams
  >({
    mutationFn: async (params) => authFetch.post("processes/kill", params),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["processes"] }),
  });

  return { getProcessesQuery, killProcessQuery, terminateProcessQuery };
}
