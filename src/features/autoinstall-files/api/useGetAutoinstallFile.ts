import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/ApiError";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { AutoinstallFile } from "../types";
import type { AutoinstallFileWithVersions } from "../types/AutoinstallFile";

interface GetAutoinstallFileParams {
  version?: number;
  with_versions?: boolean;
}

export default function useGetAutoinstallFile(
  id: number,
  params: {
    version?: number;
    with_versions: true;
  },
): {
  autoinstallFile: AutoinstallFileWithVersions | null;
  isAutoinstallFileLoading: boolean;
};

export default function useGetAutoinstallFile(
  id: number,
  params: {
    version?: number;
    with_versions: false;
  },
): {
  autoinstallFile: AutoinstallFile | null;
  isAutoinstallFileLoading: boolean;
};

export default function useGetAutoinstallFile(
  id: number,
  params: GetAutoinstallFileParams,
): {
  autoinstallFile: AutoinstallFile | AutoinstallFileWithVersions | null;
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
