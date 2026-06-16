import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { InstancesExportJob } from "../types/InstancesExportJob";
import type { CreateInstancesExportJobParams } from "./instancesExportJobsShared";

export const useExportInstancesCsv = () => {
  const authFetch = useFetch();
  const queryClient = useQueryClient();

  const { isPending, mutateAsync } = useMutation<
    AxiosResponse<InstancesExportJob>,
    AxiosError<ApiError>,
    CreateInstancesExportJobParams
  >({
    mutationFn: async (params) =>
      authFetch.post<InstancesExportJob>("computers/export/csv", params),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["instances-export-jobs"],
      });
    },
  });

  return {
    exportInstancesCsv: mutateAsync,
    isExportInstancesCsvLoading: isPending,
  };
};
