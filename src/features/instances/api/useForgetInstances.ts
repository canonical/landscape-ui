import useFetchOld from "@/hooks/useFetchOld";
import type { ApiError } from "@/types/api/ApiError";
import type { Instance } from "@/types/Instance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

export interface RemoveInstancesParams {
  computer_ids: number[];
}

export const useForgetInstances = () => {
  const authFetchOld = useFetchOld();
  const queryClient = useQueryClient();

  const { isPending, mutateAsync } = useMutation<
    AxiosResponse<Instance[]>,
    AxiosError<ApiError>,
    RemoveInstancesParams
  >({
    mutationFn: async (params) =>
      authFetchOld.get("RemoveComputers", { params }),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["instances"] }),
  });

  return {
    forgetInstances: mutateAsync,
    isForgettingInstances: isPending,
  };
};
