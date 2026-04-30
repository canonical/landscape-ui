import useFetchDebArchive from "@/hooks/useFetchDebArchive";
import type {
  ListMirrorPackagesData,
  ListMirrorPackagesError,
  ListMirrorPackagesResponse,
} from "@canonical/landscape-openapi";
import type { UseQueryOptions } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

export function useListMirrorPackages(
  mirrorName: ListMirrorPackagesData["path"]["parent_1"],
  params: ListMirrorPackagesData["query"] = {},
  options: Omit<
    UseQueryOptions<
      AxiosResponse<ListMirrorPackagesResponse>,
      AxiosError<ListMirrorPackagesError>
    >,
    "queryKey" | "queryFn"
  > = {},
) {
  const authFetchDebArchive = useFetchDebArchive();

  return useQuery<
    AxiosResponse<ListMirrorPackagesResponse>,
    AxiosError<ListMirrorPackagesError>
  >({
    queryKey: ["mirrorPackages", mirrorName, params],
    queryFn: async () =>
      authFetchDebArchive.get(`${mirrorName}/packages`, { params }),
    retry: false,
    ...options,
  });
}
