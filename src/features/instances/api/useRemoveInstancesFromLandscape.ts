import useAuth from "@/hooks/useAuth";
import useFetch from "@/hooks/useFetch";
import useFetchOld from "@/hooks/useFetchOld";
import type { ApiError } from "@/types/api/ApiError";
import type { Instance } from "@/types/Instance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

export interface RemoveInstancesParams {
  computer_ids: number[];
}

// Currently determining which endpoint to use with a feature flag
export const useRemoveInstancesFromLandscape = () => {
  const { isFeatureEnabled } = useAuth();
  const queryClient = useQueryClient();
  const authFetch = useFetch();
  const authFetchOld = useFetchOld();
  const isComputerSoftDeletionEnabled = isFeatureEnabled(
    "computer-soft-deletion",
  );

  const { isPending, mutateAsync } = useMutation<
    AxiosResponse<Instance[]>,
    AxiosError<ApiError>,
    RemoveInstancesParams
  >({
    mutationFn: async (params: RemoveInstancesParams) => {
      if (isComputerSoftDeletionEnabled) {
        return authFetch.post("/computers:delete", params);
      }

      return authFetchOld.get("RemoveComputers", { params });
    },
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["instances"] }),
  });

  return {
    removeInstancesFromLandscape: mutateAsync,
    isRemovingInstancesFromLandscape: isPending,
  };
};
