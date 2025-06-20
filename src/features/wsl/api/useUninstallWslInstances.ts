import type { Activity } from "@/features/activities";
import useFetchOld from "@/hooks/useFetchOld";
import type { ApiError } from "@/types/api/ApiError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

interface UninstallWslInstancesParams {
  computer_ids: number[];
}

export const useUninstallWslInstances = () => {
  const authFetchOld = useFetchOld();
  const queryClient = useQueryClient();

  const { isPending, mutateAsync } = useMutation<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    UninstallWslInstancesParams
  >({
    mutationFn: async (params) =>
      authFetchOld.get("DeleteChildComputers", { params }),
    onSuccess: async () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["wsl-hosts"] }),
        queryClient.invalidateQueries({ queryKey: ["instances"] }),
      ]),
  });

  return {
    isUninstallingWslInstances: isPending,
    uninstallWslInstances: mutateAsync,
  };
};
