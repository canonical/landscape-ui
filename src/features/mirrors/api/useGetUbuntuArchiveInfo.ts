import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import type { UseQueryOptions } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { UbuntuArchiveInfo } from "../types/UbuntuArchiveInfo";

export function useGetUbuntuArchiveInfo(
  options: Omit<
    UseQueryOptions<AxiosResponse<UbuntuArchiveInfo>, AxiosError<ApiError>>,
    "queryKey" | "queryFn"
  > = {},
) {
  const authFetch = useFetch();

  return useQuery<AxiosResponse<UbuntuArchiveInfo>, AxiosError<ApiError>>({
    queryKey: ["ubuntuArchiveInfo", "archive"],
    queryFn: async () =>
      authFetch.get("repository/ubuntu-archive-info", {
        params: {
          archive_type: "archive",
        },
      }),
    ...options,
  });
}
