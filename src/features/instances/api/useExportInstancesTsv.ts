import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { InstancesExportJob } from "../types/InstancesExportJob";
import type { InstanceListParams } from "../helpers";

interface CreateInstancesExportJobParams extends InstanceListParams {
  readonly name: string;
  readonly selected_field_ids: string[];
  readonly retain_until: string;
}

export const useExportInstancesTsv = () => {
  const authFetch = useFetch();
  const queryClient = useQueryClient();

  const { isPending, mutateAsync } = useMutation<
    AxiosResponse<InstancesExportJob>,
    AxiosError<ApiError>,
    CreateInstancesExportJobParams
  >({
    mutationFn: async (params) =>
      authFetch.post<InstancesExportJob>("computers/exports", params),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["all-export-jobs"],
      });
    },
  });

  return {
    exportInstancesTsv: mutateAsync,
    isExportInstancesTsvLoading: isPending,
  };
};
