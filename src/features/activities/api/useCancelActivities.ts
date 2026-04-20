import useFetchOld from "@/hooks/useFetchOld";
import type { ApiError } from "@/types/api/ApiError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { CancelActivitiesParams } from "../types";

const useCancelActivities = () => {
  const authFetchOld = useFetchOld();
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation<
    number[],
    AxiosError<ApiError>,
    CancelActivitiesParams
  >({
    mutationKey: ["activities", "cancel"],
    mutationFn: async (params) =>
      authFetchOld.get("CancelActivities", { params }),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["activities"] }),
  });

  return {
    cancelActivities: mutateAsync,
    isCancelingActivities: isPending,
  };
};

export default useCancelActivities;