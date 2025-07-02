import useFetchOld from "@/hooks/useFetchOld";
import type { ApiError } from "@/types/api/ApiError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

interface RemoveScriptAttachmentParams {
  filename: string;
  script_id: number;
}

export const useRemoveScriptAttachment = () => {
  const authFetch = useFetchOld();
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation<
    AxiosResponse,
    AxiosError<ApiError>,
    RemoveScriptAttachmentParams
  >({
    mutationKey: ["scripts", "removeAttachment"],
    mutationFn: async (params) =>
      authFetch.get("RemoveScriptAttachment", { params }),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["scripts"] }),
  });

  return {
    removeScriptAttachment: mutateAsync,
    isRemovingScriptAttachment: isPending,
  };
};
