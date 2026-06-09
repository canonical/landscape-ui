import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { InstancesExportJob } from "../types/InstancesExportJob";
import {
  EXPORT_JOBS_QUERY_KEY,
  getExportJobsFromResponse,
  setExportJobsResponseCache,
  type CreateInstancesExportJobParams,
  type InstancesExportJobsResponse,
} from "./instancesExportJobsShared";

export const useExportInstancesCsv = () => {
  const authFetch = useFetch();
  const queryClient = useQueryClient();

  const { isPending, mutateAsync } = useMutation<
    InstancesExportJob,
    AxiosError<ApiError>,
    CreateInstancesExportJobParams
  >({
    mutationFn: async (params) =>
      (await authFetch.post<InstancesExportJob>("computers/export/csv", params))
        .data,
    onSuccess: (job) => {
      queryClient.setQueryData<
        AxiosResponse<InstancesExportJobsResponse> | undefined
      >(
        EXPORT_JOBS_QUERY_KEY,
        (current) =>
          setExportJobsResponseCache(current, [
            job,
            ...getExportJobsFromResponse(current),
          ]),
      );
      void queryClient.invalidateQueries({ queryKey: EXPORT_JOBS_QUERY_KEY });
    },
  });

  return {
    exportInstancesCsv: mutateAsync,
    isExportInstancesCsvLoading: isPending,
  };
};
