import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

interface GetUSGProfileAuditDownloadParams {
  path: string;
}

export const useGetUsgProfileAuditDownload = () => {
  const authFetch = useFetch();

  const { isPending, mutateAsync } = useMutation<
    AxiosResponse<Blob>,
    AxiosError<ApiError>,
    GetUSGProfileAuditDownloadParams
  >({
    mutationFn: async ({ path }) =>
      authFetch.get(`usg-profiles/blob?path=${path}`, {
        responseType: "blob",
      }),
  });

  return {
    getUsgProfileAuditDownload: mutateAsync,
    isUsgProfileAuditDownloadLoading: isPending,
  };
};
