import useFetchOld from "@/hooks/useFetchOld";
import type { ApiError } from "@/types/api/ApiError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

export interface CreateScriptAttachmentParams {
  // <filename>$$<base64 encoded file contents>
  file: string;
  script_id: number;
}

export const useCreateScriptAttachment = () => {
  const authFetch = useFetchOld();
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation<
    AxiosResponse,
    AxiosError<ApiError>,
    CreateScriptAttachmentParams
  >({
    mutationKey: ["scripts", "createAttachment"],
    mutationFn: async (params) =>
      authFetch.get("CreateScriptAttachment", { params }),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["scripts"] }),
  });

  return {
    createScriptAttachment: mutateAsync,
    isCreatingScriptAttachment: isPending,
  };
};
