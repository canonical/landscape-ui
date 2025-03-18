import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/ApiError";
import type { ApiPaginatedResponse } from "@/types/ApiPaginatedResponse";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { AutoinstallFile, WithGroups } from "../types";

export interface GetAutoinstallFilesParams {
  employee_group_id?: number;
  limit: number;
  offset: number;
  search?: string;
  with_groups?: boolean;
}

export interface GetAutoinstallFilesResult<
  T extends GetAutoinstallFilesParams,
> {
  autoinstallFiles: (T extends { with_groups: true }
    ? WithGroups<AutoinstallFile>
    : AutoinstallFile)[];
  autoinstallFilesCount: number | undefined;
  isAutoinstallFilesLoading: boolean;
}

export const useGetAutoinstallFiles = <T extends GetAutoinstallFilesParams>(
  params: T,
): GetAutoinstallFilesResult<T> => {
  const authFetch = useFetch();

  const { data: response, isLoading } = useQuery<
    AxiosResponse<
      ApiPaginatedResponse<
        GetAutoinstallFilesResult<T>["autoinstallFiles"][number]
      >
    >,
    AxiosError<ApiError>
  >({
    queryKey: ["autoinstallFile", params],
    queryFn: async () =>
      authFetch.get(`autoinstall`, {
        params,
      }),
  });

  return {
    autoinstallFiles: response?.data.results ?? [],
    autoinstallFilesCount: response?.data.count,
    isAutoinstallFilesLoading: isLoading,
  };
};
