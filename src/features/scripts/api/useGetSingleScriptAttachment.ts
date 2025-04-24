import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

interface GetSingleScriptAttachmentParams {
  attachmentId: number;
  scriptId: number;
}

export const useGetSingleScriptAttachment = (
  { attachmentId, scriptId }: GetSingleScriptAttachmentParams,
  config: { enabled?: boolean } = {
    enabled: true,
  },
) => {
  const authFetch = useFetch();

  const {
    data: response,
    isLoading,
    refetch,
  } = useQuery<AxiosResponse<string>, AxiosError<ApiError>>({
    queryKey: ["scripts", "attachment", attachmentId],
    queryFn: async () =>
      authFetch.get(`scripts/${scriptId}/attachments/${attachmentId}`),
    ...config,
  });

  return {
    scriptAttachment: response?.data ?? null,
    isScriptAttachmentsLoading: isLoading,
    refetch,
  };
};
