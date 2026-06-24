import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import type { ExportJob } from "@/features/exports";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

interface CreateComplianceExportParams {
  readonly name: string;
  readonly query: string;
  readonly by_cve: boolean;
  readonly selected_field_ids: string[];
  readonly retain_until: string;
}

export const useExportComplianceTsv = () => {
  const authFetch = useFetch();
  const queryClient = useQueryClient();

  const { isPending, mutateAsync } = useMutation<
    AxiosResponse<ExportJob>,
    AxiosError<ApiError>,
    CreateComplianceExportParams
  >({
    mutationFn: async (params) =>
      authFetch.post<ExportJob>("computers/report:export", params),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["all-export-jobs"] });
    },
  });

  return {
    exportComplianceTsv: mutateAsync,
    isExportComplianceTsvLoading: isPending,
  };
};
