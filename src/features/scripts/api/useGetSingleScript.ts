import type { AxiosError, AxiosResponse } from "axios";
import type { Script } from "@/features/scripts";
import { useQuery } from "@tanstack/react-query";
import type { ApiError } from "@/types/api/ApiError";
import useFetch from "@/hooks/useFetch";

export const useGetSingleScript = (scriptId: Script["id"]) => {
  const authFetch = useFetch();

  const { data, isLoading } = useQuery<
    AxiosResponse<Script>,
    AxiosError<ApiError>
  >({
    queryKey: ["scripts", scriptId],
    queryFn: async () => authFetch.get(`scripts/${scriptId}`),
  });

  return {
    script: data ?? null,
    isScriptLoading: isLoading,
  };
};
