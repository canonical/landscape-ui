import type { Activity } from "@/features/activities";
import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

export interface SanitizeInstanceParams {
  computer_id: number;
  computer_title: string;
}

export const useSanitizeInstance = () => {
  const authFetch = useFetch();
  const queryClient = useQueryClient();

  const { isPending, mutateAsync } = useMutation<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    SanitizeInstanceParams
  >({
    mutationKey: ["instance", "sanitize"],
    mutationFn: async ({ computer_id, ...params }) =>
      authFetch.post(`computers/${computer_id}/sanitize`, params),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["instances"] }),
  });

  return {
    sanitizeInstance: mutateAsync,
    isSanitizingInstance: isPending,
  };
};
