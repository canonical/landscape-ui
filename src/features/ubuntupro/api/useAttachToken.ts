import type { Activity } from "@/features/activities";
import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

interface AttachTokenParams {
  computer_ids: number[];
  token: string;
}

interface AttachTokenResponse {
  activity: Activity;
  invalid_computer_ids: number[];
}

export default function useAttachToken() {
  const authFetch = useFetch();
  const queryClient = useQueryClient();

  const attachTokenQuery = useMutation<
    AxiosResponse<AttachTokenResponse>,
    AxiosError<ApiError>,
    AttachTokenParams
  >({
    mutationKey: ["token", "attach"],
    mutationFn: async (params) => authFetch.post("attach-token", params),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["instances"] }),
  });

  const { mutateAsync, isPending } = attachTokenQuery;

  return {
    attachToken: mutateAsync,
    isAttachingToken: isPending,
  };
}
