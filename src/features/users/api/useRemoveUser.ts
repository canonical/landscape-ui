import type { Activity } from "@/features/activities";
import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

export interface RemoveUserParams {
  computer_ids: number[];
  usernames: string[];
  delete_home?: boolean;
}

export const useRemoveUser = () => {
  const authFetch = useFetch();
  const queryClient = useQueryClient();

  const { isPending, mutateAsync } = useMutation<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    RemoveUserParams
  >({
    mutationKey: ["users", "remove"],
    mutationFn: async (params) => authFetch.delete("users", { params }),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["users"] }),
  });

  return {
    removeUser: mutateAsync,
    isRemovingUser: isPending,
  };
};
