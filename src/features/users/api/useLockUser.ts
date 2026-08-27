import type { Activity } from "@/features/activities";
import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

export interface LockUserParams {
  computer_ids: number[];
  usernames: string[];
}

export const useLockUser = () => {
  const authFetch = useFetch();
  const queryClient = useQueryClient();

  const { isPending, mutateAsync } = useMutation<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    LockUserParams
  >({
    mutationKey: ["users", "lock"],
    mutationFn: async (params) => authFetch.post("users/lock", params),
    onSuccess: async () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["users"] }),
        queryClient.invalidateQueries({ queryKey: ["userActivities"] }),
      ]),
  });

  return {
    lockUser: mutateAsync,
    isLockingUser: isPending,
  };
};
