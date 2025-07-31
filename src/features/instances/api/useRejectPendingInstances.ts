import useFetchOld from "@/hooks/useFetchOld";
import type { ApiError } from "@/types/api/ApiError";
import type { PendingInstance } from "@/types/Instance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

export interface RejectPendingInstancesParams {
  computer_ids: number[];
}

export const useRejectPendingInstances = () => {
  const authFetchOld = useFetchOld();
  const queryClient = useQueryClient();

  const { isPending, mutateAsync } = useMutation<
    AxiosResponse<PendingInstance[]>,
    AxiosError<ApiError>,
    RejectPendingInstancesParams
  >({
    mutationFn: async (params) =>
      authFetchOld.get("RejectPendingComputers", { params }),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["pendingInstances"] }),
  });

  return {
    rejectPendingInstances: mutateAsync,
    isRejectingPendingInstances: isPending,
  };
};
