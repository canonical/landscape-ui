import type { Activity } from "@/features/activities";
import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

export interface GenerateRecoveryKeyParams {
  computer_id: number;
  force?: boolean;
}

export const useGenerateRecoveryKey = () => {
  const authFetch = useFetch();
  const queryClient = useQueryClient();

  const { isPending, mutateAsync } = useMutation<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    GenerateRecoveryKeyParams
  >({
    mutationKey: ["instance", "recovery-key", "generate"],
    mutationFn: async ({ computer_id, force }) =>
      authFetch.post(`computers/${computer_id}/recovery-key:generate`, {
        force,
      }),
    onSuccess: async (_response, { computer_id }) => {
      await queryClient.invalidateQueries({
        queryKey: ["instance", "recovery-key", computer_id],
      });
    },
  });

  return {
    generateRecoveryKey: mutateAsync,
    isGeneratingRecoveryKey: isPending,
  };
};

export default useGenerateRecoveryKey;
