import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { AutoinstallFile, WithGroups, WithMetadata } from "../types";

export interface GetAutoinstallFileParams {
  id: number;
  version?: number;
  with_groups?: boolean;
  with_metadata?: boolean;
}

export type GetAutoinstallFileResult<T extends GetAutoinstallFileParams> =
  AutoinstallFile &
    (T extends { with_groups: true } ? WithGroups<AutoinstallFile> : object) &
    (T extends { with_metadata: true }
      ? WithMetadata<AutoinstallFile>
      : object);

export const useGetAutoinstallFile = <T extends GetAutoinstallFileParams>({
  id,
  ...params
}: T): {
  autoinstallFile: GetAutoinstallFileResult<T> | undefined;
  isAutoinstallFileLoading: boolean;
} => {
  const authFetch = useFetch();

  const { data: response, isLoading } = useQuery<
    AxiosResponse<GetAutoinstallFileResult<T>>,
    AxiosError<ApiError>
  >({
    queryKey: ["autoinstallFiles", id, { ...params }],
    queryFn: async () =>
      authFetch.get(`autoinstall/${id}`, {
        params,
      }),
  });

  return {
    autoinstallFile: response?.data,
    isAutoinstallFileLoading: isLoading,
  };
};
