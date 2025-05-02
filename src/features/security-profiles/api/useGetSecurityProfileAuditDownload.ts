import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

interface GetSecurityProfileAuditDownloadParams {
  path: string;
}

export const useGetSecurityProfileAuditDownload = () => {
  const authFetch = useFetch();

  const { isPending, mutateAsync } = useMutation<
    AxiosResponse<string>,
    AxiosError<ApiError>,
    GetSecurityProfileAuditDownloadParams
  >({
    mutationFn: async ({ path }) =>
      authFetch.get(`security-profiles/blob?path=${path}`),
  });

  return {
    getSecurityProfileAuditDownload: mutateAsync,
    isSecurityProfileAuditDownloadLoading: isPending,
  };
};
