import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { ScriptVersion } from "../types";

interface UseGetScriptVersionParams {
  scriptId: number;
  versionId: number;
}

export const useGetScriptVersion = ({
  scriptId,
  versionId,
}: UseGetScriptVersionParams) => {
  const authFetch = useFetch();

  const { data: response, isPending } = useQuery<
    AxiosResponse<ScriptVersion>,
    AxiosError<ApiError>
  >({
    queryKey: ["scripts", "version", scriptId, versionId],
    queryFn: async () =>
      authFetch.get(`scripts/${scriptId}/versions/${versionId}`),
  });

  return {
    version: response?.data ?? null,
    isVersionLoading: isPending,
  };
};
