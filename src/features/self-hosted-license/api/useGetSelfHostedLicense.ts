import useAuthAccounts from "@/hooks/useAuthAccounts";
import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

interface SelfHostedLicenseResponse {
  license_url: string;
}

export const getSelfHostedLicenseQueryKey = (accountName: string) =>
  ["selfHostedLicense", accountName] as const;

export const useGetSelfHostedLicense = () => {
  const authFetch = useFetch();
  const { currentAccount } = useAuthAccounts();

  const {
    data: response,
    error,
    isPending,
  } = useQuery<AxiosResponse<SelfHostedLicenseResponse>, AxiosError<ApiError>>({
    queryKey: getSelfHostedLicenseQueryKey(currentAccount.name),
    queryFn: async () => authFetch.get("self-hosted/license-url"),
  });

  return {
    downloadUrl: response?.data.license_url,
    selfHostedLicenseError: error,
    isGettingSelfHostedLicense: isPending,
  };
};
