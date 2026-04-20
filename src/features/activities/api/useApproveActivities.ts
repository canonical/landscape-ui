import useFetchOld from "@/hooks/useFetchOld";
import type { ApiError } from "@/types/api/ApiError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { ApproveActivitiesParams } from "../types";

const useApproveActivities = () => {
  const authFetchOld = useFetchOld();
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation<
    string[],
    AxiosError<ApiError>,
    ApproveActivitiesParams
  >({
    mutationKey: ["activities", "approve"],
    mutationFn: async (params) =>
      authFetchOld.get("ApproveActivities", { params }),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["activities"] }),
  });

  return {
    approveActivities: mutateAsync,
    isApprovingActivities: isPending,
  };
};

export default useApproveActivities;
