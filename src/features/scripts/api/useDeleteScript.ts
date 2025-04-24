import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

interface RemoveScriptParams {
  script_id: number;
}

export const useRemoveScript = () => {
  const authFetch = useFetch();
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation<
    AxiosResponse,
    AxiosError<ApiError>,
    RemoveScriptParams
  >({
    mutationFn: async ({ script_id }) =>
      authFetch.post(`scripts/${script_id}:redact`),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["scripts"] }),
  });

  return {
    removeScript: mutateAsync,
    isRemoving: isPending,
  };
};
