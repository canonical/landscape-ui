import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { RedoActivitiesParams } from "../types";

const useRedoActivities = () => {
  const authFetch = useFetch();
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation<
    number[],
    AxiosError<ApiError>,
    RedoActivitiesParams
  >({
    mutationKey: ["activities", "redo"],
    mutationFn: async (params) => authFetch.post("activities/reapply", params),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["activities"] }),
  });

  return {
    redoActivities: mutateAsync,
    isRedoingActivities: isPending,
  };
};

export default useRedoActivities;
