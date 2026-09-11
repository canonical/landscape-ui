import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

interface SelfHostedEnabledResponse {
  enabled: boolean;
}

export const useGetSelfHostedEnabled = (enabled: boolean) => {
  const authFetch = useFetch();

  const { data: response, isPending, isError } = useQuery<
    AxiosResponse<SelfHostedEnabledResponse>,
    AxiosError<ApiError>
  >({
    queryKey: ["selfHostedEnabled"],
    queryFn: async () => authFetch.get("self-hosted/status"),
    enabled,
  });

  return {
    isGettingSelfHostedEnabled: isPending,
    isSelfHostedEnabled: response?.data.enabled ?? false,
    isSelfHostedEnabledError: isError,
  };
};