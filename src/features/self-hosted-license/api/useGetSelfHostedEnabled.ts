import useAuthAccounts from "@/hooks/useAuthAccounts";
import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

interface SelfHostedEnabledResponse {
  enabled: boolean;
}

export const useGetSelfHostedEnabled = (enabled: boolean) => {
  const authFetch = useFetch();
  const { currentAccount } = useAuthAccounts();

  const {
    data: response,
    error,
    isFetching,
  } = useQuery<AxiosResponse<SelfHostedEnabledResponse>, AxiosError<ApiError>>({
    queryKey: ["selfHostedEnabled", currentAccount.name],
    queryFn: async () => authFetch.get("self-hosted/status"),
    enabled,
  });

  return {
    isGettingSelfHostedEnabled: isFetching,
    isSelfHostedEnabled: response?.data.enabled ?? false,
    selfHostedEnabledError: error,
  };
};
