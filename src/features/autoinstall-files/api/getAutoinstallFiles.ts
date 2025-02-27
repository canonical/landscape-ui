import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/ApiError";
import type { ApiPaginatedResponse } from "@/types/ApiPaginatedResponse";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { AutoinstallFile, AutoinstallFileWithGroups } from "../types";

interface GetAutoinstallFilesParams {
  with_groups?: boolean;
}

export default function useAutoinstallFiles(params: {
  with_groups: false;
}): AutoinstallFile[] | null;

export default function useAutoinstallFiles(params: {
  with_groups: true;
}): AutoinstallFileWithGroups[] | null;

export default function useAutoinstallFiles(
  params: GetAutoinstallFilesParams,
): (AutoinstallFile | AutoinstallFileWithGroups)[] | null {
  const authFetch = useFetch();

  const { data: response } = useQuery<
    AxiosResponse<ApiPaginatedResponse<AutoinstallFile>>,
    AxiosError<ApiError>
  >({
    queryKey: ["autoinstallFile", params],
    queryFn: () =>
      authFetch.get(`autoinstall`, {
        params,
      }),
  });

  return response ? response.data.results : null;
}
