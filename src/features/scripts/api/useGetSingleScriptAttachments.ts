import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { SingleScript } from "../types";

export const useGetSingleScriptAttachments = (
  scriptId: SingleScript["id"],
  config: { enabled?: boolean } = {
    enabled: true,
  },
) => {
  const authFetch = useFetch();

  const { data: response, isLoading } = useQuery<
    AxiosResponse<unknown>,
    AxiosError<ApiError>
  >({
    queryKey: ["scripts", "attachments", scriptId],
    queryFn: async () => authFetch.get(`scripts-attachments/${scriptId}`),
    ...config,
  });

  return {
    scriptAttachments: (response?.data as unknown[]) ?? null,
    isScriptAttachmentsLoading: isLoading,
  };
};
