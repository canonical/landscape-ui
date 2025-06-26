import type { Activity } from "@/features/activities";
import useFetchOld from "@/hooks/useFetchOld";
import type { ApiError } from "@/types/api/ApiError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

export interface ShutDownInstancesParams {
  computer_ids: number[];
  deliver_after?: string;
}

export const useShutDownInstances = () => {
  const authFetchOld = useFetchOld();
  const queryClient = useQueryClient();

  const { isPending, mutateAsync } = useMutation<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    ShutDownInstancesParams
  >({
    mutationFn: async (params) =>
      authFetchOld.get("ShutdownComputers", { params }),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["instances"] }),
  });

  return {
    shutDownInstances: mutateAsync,
    isShuttingDownInstances: isPending,
  };
};
