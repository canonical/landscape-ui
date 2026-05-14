import type { Activity } from "@/features/activities";
import useFetchOld from "@/hooks/useFetchOld";
import type { ApiError } from "@/types/api/ApiError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

interface RemoveUpgradeProfileParams {
  name: string;
}

export const useRemoveUpgradeProfile = () => {
  const authFetchOld = useFetchOld();
  const queryClient = useQueryClient();

  const { isPending, mutateAsync } = useMutation<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    RemoveUpgradeProfileParams
  >({
    mutationKey: ["upgradeProfiles", "remove"],
    mutationFn: async (params) =>
      authFetchOld.get("RemoveUpgradeProfile", { params }),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["upgradeProfiles"] }),
  });

  return {
    removeUpgradeProfile: mutateAsync,
    isRemovingUpgradeProfile: isPending,
  };
};
