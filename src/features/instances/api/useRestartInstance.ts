import type { Activity } from "@/features/activities";
import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

export interface RestartInstanceParams {
  id: number;
  deliver_after?: string;
  deliver_delay_window?: number;
}

export const useRestartInstance = () => {
  const authFetch = useFetch();
  const queryClient = useQueryClient();

  const { isPending, mutateAsync } = useMutation<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    RestartInstanceParams
  >({
    mutationFn: async ({ id, ...queryParams }) =>
      authFetch.post(`computers/${id}/restart`, queryParams),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["instances"] }),
  });

  return {
    restartInstance: mutateAsync,
    isRestartingInstance: isPending,
  };
};
