import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

interface SelfHostedLicenseResponse {
  download_url: string;
}

export const useGetSelfHostedLicense = () => {
  const authFetch = useFetch();

  const { data: response, isPending } = useQuery<
    AxiosResponse<SelfHostedLicenseResponse>,
    AxiosError<ApiError>
  >({
    queryKey: ["selfHostedLicense"],
    queryFn: async () => authFetch.get("self-hosted/license"),
  });

  return {
    downloadUrl: response?.data.download_url,
    isGettingSelfHostedLicense: isPending,
  };
};
