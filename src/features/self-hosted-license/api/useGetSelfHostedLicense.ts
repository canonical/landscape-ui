import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

interface SelfHostedLicenseResponse {
  license_url: string;
}

export const useGetSelfHostedLicense = () => {
  const authFetch = useFetch();

  const { data: response, isPending } = useQuery<
    AxiosResponse<SelfHostedLicenseResponse>,
    AxiosError<ApiError>
  >({
    queryKey: ["selfHostedLicense"],
    queryFn: async () => authFetch.get("self-hosted/license-url"),
  });

  return {
    downloadUrl: response?.data.license_url,
    isGettingSelfHostedLicense: isPending,
  };
};
