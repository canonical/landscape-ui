import type { Activity } from "@/features/activities";
import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

export interface UnlockUserParams {
  computer_ids: number[];
  usernames: string[];
}

export const useUnlockUser = () => {
  const authFetch = useFetch();
  const queryClient = useQueryClient();

  const { isPending, mutateAsync } = useMutation<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    UnlockUserParams
  >({
    mutationKey: ["users", "unlock"],
    mutationFn: async (params) => authFetch.post("users/unlock", params),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["users"] }),
  });

  return {
    unlockUser: mutateAsync,
    isUnlockingUser: isPending,
  };
};
