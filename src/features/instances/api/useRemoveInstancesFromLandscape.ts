import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import type { Instance } from "@/types/Instance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

export interface RemoveInstancesParams {
  computer_ids: number[];
}

export const useRemoveInstancesFromLandscape = () => {
  const authFetch = useFetch();
  const queryClient = useQueryClient();

  const { isPending, mutateAsync } = useMutation<
    AxiosResponse<Instance[]>,
    AxiosError<ApiError>,
    RemoveInstancesParams
  >({
    mutationFn: async (params) => authFetch.post("computers:delete", params),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["instances"] }),
  });

  return {
    removeInstancesFromLandscape: mutateAsync,
    isRemovingInstancesFromLandscape: isPending,
  };
};
