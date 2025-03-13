import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/ApiError";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { AutoinstallFile, WithGroups, WithVersions } from "../types";

interface GetAutoinstallFileParams {
  id: number;
  version?: number;
  with_groups?: boolean;
  with_versions?: boolean;
}

type GetAutoinstallFileResult<T extends GetAutoinstallFileParams> =
  AutoinstallFile &
    (T extends { with_groups: true } ? WithGroups<AutoinstallFile> : object) &
    (T extends { with_versions: true }
      ? WithVersions<AutoinstallFile>
      : object);

const useGetAutoinstallFile = <T extends GetAutoinstallFileParams>({
  id,
  ...params
}: T): {
  autoinstallFile: GetAutoinstallFileResult<T> | null;
  isAutoinstallFileLoading: boolean;
} => {
  const authFetch = useFetch();

  const { data: response, isLoading } = useQuery<
    AxiosResponse<GetAutoinstallFileResult<T>>,
    AxiosError<ApiError>
  >({
    queryKey: ["autoinstallFile", { ...params }],
    queryFn: async () =>
      authFetch.get(`autoinstall/${id}`, {
        params,
      }),
  });

  return {
    autoinstallFile: response?.data ?? null,
    isAutoinstallFileLoading: isLoading,
  };
};

export default useGetAutoinstallFile;
