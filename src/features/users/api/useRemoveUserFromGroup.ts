import type { Activity } from "@/features/activities";
import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

export interface RemoveUserFromGroupParams {
  computer_id: number;
  groupnames: string[];
  usernames: string[];
}

export const useRemoveUserFromGroup = () => {
  const authFetch = useFetch();
  const queryClient = useQueryClient();

  const { isPending, mutateAsync } = useMutation<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    RemoveUserFromGroupParams
  >({
    mutationKey: ["groups", "remove"],
    mutationFn: async (params) =>
      authFetch.post(`computers/${params.computer_id}/usergroups/update_bulk`, {
        ...params,
        action: "remove",
      }),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["users"] }),
  });

  return {
    removeUserFromGroup: mutateAsync,
    isRemovingUserFromGroup: isPending,
  };
};
