import type { Activity } from "@/features/activities";
import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

interface UninstallWslInstancesParams {
  parent_id: number;
  child_names: string[];
}

export const useUninstallWslInstances = () => {
  const authFetch = useFetch();
  const queryClient = useQueryClient();

  const { isPending, mutateAsync } = useMutation<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    UninstallWslInstancesParams
  >({
    mutationFn: async ({ parent_id, ...params }) =>
      authFetch.post(`computers/${parent_id}/delete-children`, params),
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
