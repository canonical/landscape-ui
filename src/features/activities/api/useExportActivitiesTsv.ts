import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { ActivitiesExportJob } from "../types/ActivitiesExportJob";

interface CreateActivitiesExportJobParams {
  readonly name: string;
  readonly query: string;
  readonly selected_activity_ids: number[];
  readonly selected_field_ids: string[];
  readonly retain_until: string;
}

export const useExportActivitiesTsv = () => {
  const authFetch = useFetch();
  const queryClient = useQueryClient();

  const { isPending, mutateAsync } = useMutation<
    AxiosResponse<ActivitiesExportJob>,
    AxiosError<ApiError>,
    CreateActivitiesExportJobParams
  >({
    mutationFn: async (params) =>
      authFetch.post<ActivitiesExportJob>("activities/exports", params),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["all-export-jobs"],
      });
    },
  });

  return {
    exportActivitiesTsv: mutateAsync,
    isExportActivitiesTsvLoading: isPending,
  };
};
