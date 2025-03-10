import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/ApiError";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { AutoinstallFile, WithGroups, WithVersions } from "../types";

interface GetAutoinstallFileParams {
  version?: number;
  with_groups?: boolean;
  with_versions?: boolean;
}

type GetAutoinstallFileResult<T extends AutoinstallFile> =
  | {
      autoinstallFile: WithVersions<WithGroups<T>>;
      isAutoinstallFileLoading: false;
    }
  | { autoinstallFile: null; isAutoinstallFileLoading: true };

export default function useGetAutoinstallFile(
  id: number,
  params: {
    with_groups: true;
    with_versions: true;
  } & GetAutoinstallFileParams,
): GetAutoinstallFileResult<WithVersions<WithGroups<AutoinstallFile>>>;

export default function useGetAutoinstallFile(
  id: number,
  params: {
    with_groups: true;
  } & GetAutoinstallFileParams,
): GetAutoinstallFileResult<WithGroups<AutoinstallFile>>;

export default function useGetAutoinstallFile(
  id: number,
  params: {
    with_versions: true;
  } & GetAutoinstallFileParams,
): GetAutoinstallFileResult<WithVersions<AutoinstallFile>>;

export default function useGetAutoinstallFile(
  id: number,
  params?: GetAutoinstallFileParams,
): GetAutoinstallFileResult<AutoinstallFile>;

export default function useGetAutoinstallFile(
  id: number,
  params?: GetAutoinstallFileParams,
):
  | {
      autoinstallFile: AutoinstallFile;
      isAutoinstallFileLoading: false;
    }
  | { autoinstallFile: null; isAutoinstallFileLoading: true } {
  const authFetch = useFetch();

  const { data: response } = useQuery<
    AxiosResponse<AutoinstallFile>,
    AxiosError<ApiError>
  >({
    queryKey: ["autoinstallFile", { id, ...params }],
    queryFn: async () =>
      authFetch.get(`autoinstall/${id}`, {
        params,
      }),
  });

  return response
    ? {
        autoinstallFile: response.data,
        isAutoinstallFileLoading: false,
      }
    : {
        autoinstallFile: null,
        isAutoinstallFileLoading: true,
      };
}
