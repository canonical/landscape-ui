import type { Activity } from "@/features/activities";
import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

interface DetachTokenParams {
  computer_ids: number[];
}

export default function useDetachToken() {
  const authFetch = useFetch();
  const queryClient = useQueryClient();

  const detachTokenQuery = useMutation<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    DetachTokenParams
  >({
    mutationKey: ["token", "detach"],
    mutationFn: async (params) => authFetch.post("detach-token", params),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["instances"] }),
  });

  const { mutateAsync, isPending } = detachTokenQuery;

  return {
    detachToken: mutateAsync,
    isDetachingToken: isPending,
  };
}
