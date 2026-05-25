import type { Activity } from "@/features/activities";
import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

export interface RunUSGProfileParams {
  id: number;
}

export const useRunUsgProfile = () => {
  const authFetch = useFetch();
  const queryClient = useQueryClient();

  const { isPending, mutateAsync } = useMutation<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    RunUSGProfileParams
  >({
    mutationFn: async ({ id }) => authFetch.post(`usg-profiles/${id}:execute`),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["usgProfiles"] }),
  });

  return {
    isRunningUsgProfile: isPending,
    runUsgProfile: mutateAsync,
  };
};
