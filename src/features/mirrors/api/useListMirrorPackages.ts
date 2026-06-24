import useFetchDebArchive from "@/hooks/useFetchDebArchive";
import type {
  MirrorServiceListMirrorPackagesData,
  MirrorServiceListMirrorPackagesError,
  MirrorServiceListMirrorPackagesResponse,
} from "@canonical/landscape-openapi";
import type { UseQueryOptions } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

export function useListMirrorPackages(
  mirrorName: string,
  params: MirrorServiceListMirrorPackagesData["query"] = {},
  options: Omit<
    UseQueryOptions<
      AxiosResponse<MirrorServiceListMirrorPackagesResponse>,
      AxiosError<MirrorServiceListMirrorPackagesError>
    >,
    "queryKey" | "queryFn"
  > = {},
) {
  const authFetchDebArchive = useFetchDebArchive();

  return useQuery<
    AxiosResponse<MirrorServiceListMirrorPackagesResponse>,
    AxiosError<MirrorServiceListMirrorPackagesError>
  >({
    queryKey: ["mirrorPackages", mirrorName, params],
    queryFn: async () =>
      authFetchDebArchive.get(`${mirrorName}/packages`, { params }),
    retry: false,
    ...options,
  });
}
