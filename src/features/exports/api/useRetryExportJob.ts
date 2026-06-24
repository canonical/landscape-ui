import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { ExportJob } from "../types/ExportJob";

export const useRetryExportJob = () => {
  const authFetch = useFetch();
  const queryClient = useQueryClient();

  const { mutateAsync } = useMutation<
    AxiosResponse<ExportJob>,
    AxiosError<ApiError>,
    number
  >({
    mutationFn: async (jobId) =>
      authFetch.post<ExportJob>(`exports/${jobId}/retry`),
    onSuccess: async (_, jobId) => {
      // Remove the old (failed) job from cache before invalidating so the
      // global QueryCache error handler doesn't fire when the backend returns
      // 404 for the now-discarded job. The detail query is keyed by the string
      // URL param, so match that here.
      queryClient.removeQueries({
        queryKey: ["all-export-jobs", String(jobId)],
      });
      await queryClient.invalidateQueries({ queryKey: ["all-export-jobs"] });
    },
  });

  return { retryExportJob: mutateAsync };
};
