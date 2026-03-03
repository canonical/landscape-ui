import type { Activity } from "@/features/activities";
import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

export interface CreateDistributionUpgradesParams {
  computer_ids: number[];
}

export const useCreateDistributionUpgrades = () => {
  const authFetch = useFetch();
  const queryClient = useQueryClient();

  const { isPending, mutateAsync } = useMutation<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    CreateDistributionUpgradesParams
  >({
    mutationFn: async (params) =>
      authFetch.post("computers/release-upgrades", params),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["activities"] }),
  });

  return {
    createDistributionUpgrades: mutateAsync,
    isCreatingDistributionUpgrades: isPending,
  };
};
