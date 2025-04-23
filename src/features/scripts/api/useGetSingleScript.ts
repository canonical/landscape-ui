import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { SingleScript } from "../types";

interface Config {
  enabled?: boolean;
}

export const useGetSingleScript = (
  scriptId: SingleScript["id"],
  config: Config = { enabled: true },
) => {
  const authFetch = useFetch();

  const { data: response, isLoading } = useQuery<
    AxiosResponse<SingleScript>,
    AxiosError<ApiError>
  >({
    queryKey: ["scripts", scriptId],
    queryFn: async () => authFetch.get(`scripts/${scriptId}`),
    ...config,
  });

  return {
    script: response?.data ?? null,
    isScriptLoading: isLoading,
  };
};
