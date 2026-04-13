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

  if (isFeatureEnabled("computer-soft-deletion")) {
    const authFetch = useFetch();
    const { isPending, mutateAsync } = useMutation<
      AxiosResponse<Instance[]>,
      AxiosError<ApiError>,
      RemoveInstancesParams
    >({
      mutationFn: async (params: RemoveInstancesParams) =>
        authFetch.post("/computers:delete", params),
      onSuccess: async () =>
        queryClient.invalidateQueries({ queryKey: ["instances"] }),
    });

    return {
      removeInstancesFromLandscape: mutateAsync,
      isRemovingInstancesFromLandscape: isPending,
    };
  }

  const authFetchOld = useFetchOld();
  const { isPending, mutateAsync } = useMutation<
    AxiosResponse<Instance[]>,
    AxiosError<ApiError>,
    RemoveInstancesParams
  >({
    mutationFn: async (params: RemoveInstancesParams) =>
      authFetchOld.get("RemoveComputers", { params }),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["instances"] }),
  });

  return {
    removeInstancesFromLandscape: mutateAsync,
    isRemovingInstancesFromLandscape: isPending,
  };
};
