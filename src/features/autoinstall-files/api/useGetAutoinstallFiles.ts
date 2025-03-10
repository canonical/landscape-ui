import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/ApiError";
import type { ApiPaginatedResponse } from "@/types/ApiPaginatedResponse";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { AutoinstallFile, WithGroups } from "../types";

interface GetAutoinstallFilesParams {
  employee_group_id?: number;
  limit: number;
  offset: number;
  search?: string;
  with_groups?: boolean;
}

interface GetAutoinstallFilesResult<T extends AutoinstallFile> {
  autoinstallFiles: T[];
  autoinstallFilesCount: number;
  isAutoinstallFilesLoading: boolean;
}

export default function useGetAutoinstallFiles(
  params: {
    with_groups: true;
  } & GetAutoinstallFilesParams,
): GetAutoinstallFilesResult<WithGroups<AutoinstallFile>>;

export default function useGetAutoinstallFiles(
  params: GetAutoinstallFilesParams,
): GetAutoinstallFilesResult<AutoinstallFile>;

export default function useGetAutoinstallFiles(
  params: GetAutoinstallFilesParams,
): GetAutoinstallFilesResult<AutoinstallFile> {
  const authFetch = useFetch();

  const { data: response, isLoading } = useQuery<
    AxiosResponse<ApiPaginatedResponse<AutoinstallFile>>,
    AxiosError<ApiError>
  >({
    queryKey: ["autoinstallFile", params],
    queryFn: async () =>
      authFetch.get(`autoinstall`, {
        params,
      }),
  });

  return response
    ? {
        autoinstallFiles: response.data.results,
        autoinstallFilesCount: response.data.count,
        isAutoinstallFilesLoading: isLoading,
      }
    : {
        autoinstallFiles: [],
        autoinstallFilesCount: 0,
        isAutoinstallFilesLoading: isLoading,
      };
}
