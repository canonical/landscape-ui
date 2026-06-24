import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

export const useCancelExportJob = () => {
  const authFetch = useFetch();
  const queryClient = useQueryClient();

  const { mutateAsync } = useMutation<
    AxiosResponse<void>,
    AxiosError<ApiError>,
    number
  >({
    mutationFn: async (jobId) => authFetch.post(`exports/${jobId}/cancel`),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["all-export-jobs"] });
    },
  });

  return { cancelExportJob: mutateAsync };
};
