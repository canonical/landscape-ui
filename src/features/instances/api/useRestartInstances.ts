import type { Activity } from "@/features/activities";
import useFetchOld from "@/hooks/useFetchOld";
import type { ApiError } from "@/types/api/ApiError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

export interface RestartInstancesParams {
  computer_ids: number[];
  deliver_after?: string;
}

export const useRestartInstances = () => {
  const authFetchOld = useFetchOld();
  const queryClient = useQueryClient();

  const { isPending, mutateAsync } = useMutation<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    RestartInstancesParams
  >({
    mutationFn: async (params) =>
      authFetchOld.get("RebootComputers", { params }),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["instances"] }),
  });

  return {
    restartInstances: mutateAsync,
    isRestartingInstances: isPending,
  };
};
