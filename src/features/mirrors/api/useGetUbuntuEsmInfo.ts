import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import type { UseQueryOptions } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { UbuntuArchiveInfo } from "../types/UbuntuArchiveInfo";

export interface UbuntuESMInfo {
  results: UbuntuArchiveInfo[];
}

export function useGetUbuntuEsmInfo(
  options: Omit<
    UseQueryOptions<AxiosResponse<UbuntuESMInfo>, AxiosError<ApiError>>,
    "queryKey" | "queryFn"
  > = {},
) {
  const authFetch = useFetch();

  return useQuery<AxiosResponse<UbuntuESMInfo>, AxiosError<ApiError>>({
    queryKey: ["ubuntuArchiveInfo", "esm"],
    queryFn: async () =>
      authFetch.get("repository/ubuntu-archive-info", {
        params: {
          archive_type: "ESM",
        },
      }),
    ...options,
  });
}
