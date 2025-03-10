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

export default function useGetAutoinstallFile(
  id: number,
  params: {
    with_groups: true;
    with_versions: true;
  } & GetAutoinstallFileParams,
): {
  autoinstallFile: WithVersions<WithGroups<AutoinstallFile>> | null;
  isAutoinstallFileLoading: boolean;
};

export default function useGetAutoinstallFile(
  id: number,
  params: {
    with_groups: true;
  } & GetAutoinstallFileParams,
): {
  autoinstallFile: WithGroups<AutoinstallFile> | null;
  isAutoinstallFileLoading: boolean;
};

export default function useGetAutoinstallFile(
  id: number,
  params: {
    with_versions: true;
  } & GetAutoinstallFileParams,
): {
  autoinstallFile: WithVersions<AutoinstallFile> | null;
  isAutoinstallFileLoading: boolean;
};

export default function useGetAutoinstallFile(
  id: number,
  params?: GetAutoinstallFileParams,
): {
  autoinstallFile: AutoinstallFile | null;
  isAutoinstallFileLoading: boolean;
};

export default function useGetAutoinstallFile(
  id: number,
  params?: GetAutoinstallFileParams,
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
    queryFn: async () =>
      authFetch.get(`autoinstall/${id}`, {
        params,
      }),
  });

  return {
    autoinstallFile: response ? response.data : null,
    isAutoinstallFileLoading: isLoading,
  };
}
