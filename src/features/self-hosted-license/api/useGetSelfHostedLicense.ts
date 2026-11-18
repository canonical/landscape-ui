import useAuthAccounts from "@/hooks/useAuthAccounts";
import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

interface SelfHostedLicenseResponse {
  license_url: string;
}

const isValidDownloadUrl = (value: unknown): value is string => {
  if (typeof value !== "string" || !/^https?:\/\//i.test(value)) {
    return false;
  }

  try {
    new URL(value);
    return true;
  } catch (error) {
    if (error instanceof TypeError) {
      return false;
    }
    throw error;
  }
};

export const getSelfHostedLicenseQueryKey = (accountName: string) =>
  ["selfHostedLicense", accountName] as const;

export const useGetSelfHostedLicense = () => {
  const authFetch = useFetch();
  const { currentAccount } = useAuthAccounts();

  const {
    data: response,
    error,
    isFetching,
    isPending,
    refetch,
  } = useQuery<AxiosResponse<SelfHostedLicenseResponse>, AxiosError<ApiError>>({
    queryKey: getSelfHostedLicenseQueryKey(currentAccount.name),
    queryFn: () => authFetch.get("self-hosted/license-url"),
  });

  const url = response?.data?.license_url;
  const downloadUrl = isValidDownloadUrl(url) ? url : undefined;

  return {
    downloadUrl,
    hasSelfHostedLicenseError: !!error || (!isPending && !downloadUrl),
    isGettingSelfHostedLicense: isPending,
    isFetchingSelfHostedLicense: isFetching,
    refetchSelfHostedLicense: refetch,
  };
};
