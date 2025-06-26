import useFetchOld from "@/hooks/useFetchOld";
import type { ApiError } from "@/types/api/ApiError";
import type { PendingInstance } from "@/types/Instance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

export interface AcceptPendingInstancesParams {
  computer_ids: number[];
  access_group?: string;
}

export const useAcceptPendingInstances = () => {
  const authFetchOld = useFetchOld();
  const queryClient = useQueryClient();

  const { isPending, mutateAsync } = useMutation<
    AxiosResponse<PendingInstance[]>,
    AxiosError<ApiError>,
    AcceptPendingInstancesParams
  >({
    mutationFn: async (params) =>
      authFetchOld.get("AcceptPendingComputers", { params }),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["pendingInstances"] }),
  });

  return {
    acceptPendingInstances: mutateAsync,
    isAcceptingPendingInstances: isPending,
  };
};
