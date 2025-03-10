import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/ApiError";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { AutoinstallFile } from "../types";

interface GetAutoinstallFileParams {
  version?: number;
}

export default function useGetAutoinstallFile(
  id: number,
  params: GetAutoinstallFileParams,
): {
  autoinstallFile: AutoinstallFile | null;
  isAutoinstallFileLoading: boolean;
} {
  const authFetch = useFetch();

  const { data: response, isLoading } = useQuery<
    AxiosResponse<AutoinstallFile>,
    AxiosError<ApiError>
  >({
    queryKey: ["autoinstallFile", { id, ...params }],
    queryFn: () =>
      authFetch.get(`autoinstall/${id}`, {
        params,
      }),
  });

  return {
    autoinstallFile: response ? response.data : null,
    isAutoinstallFileLoading: isLoading,
  };
}
