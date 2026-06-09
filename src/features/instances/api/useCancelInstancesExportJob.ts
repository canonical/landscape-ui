import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import type { InstancesExportJob } from "../types/InstancesExportJob";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import {
  EXPORT_JOBS_QUERY_KEY,
  getExportJobsFromResponse,
  setExportJobsResponseCache,
  type InstancesExportJobsResponse,
} from "./instancesExportJobsShared";

export const useCancelInstancesExportJob = () => {
  const authFetch = useFetch();
  const queryClient = useQueryClient();

  const { mutateAsync } = useMutation<
    InstancesExportJob,
    AxiosError<ApiError>,
    string
  >({
    mutationFn: async (jobId) =>
      (
        await authFetch.post<InstancesExportJob>(
          `computers/exports/${jobId}/cancel`,
        )
      ).data,
    onSuccess: (_job, jobId) => {
      queryClient.setQueryData<
        AxiosResponse<InstancesExportJobsResponse> | undefined
      >(
        EXPORT_JOBS_QUERY_KEY,
        (current) =>
          setExportJobsResponseCache(
            current,
            getExportJobsFromResponse(current).filter((job) => job.id !== jobId),
          ),
      );
      void queryClient.invalidateQueries({ queryKey: EXPORT_JOBS_QUERY_KEY });
    },
  });

  return {
    cancelInstancesExportJob: mutateAsync,
  };
};
