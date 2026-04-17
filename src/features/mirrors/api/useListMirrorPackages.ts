import useFetchDebArchive from "@/hooks/useFetchDebArchive";
import type { ApiError } from "@/types/api/ApiError";
import type {
  ListMirrorPackagesData,
  ListMirrorPackagesResponse,
} from "@canonical/landscape-openapi";
import type { UseQueryOptions } from "@tanstack/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

export function useListMirrorPackages(
  mirrorName: ListMirrorPackagesData["path"]["parent_1"],
  params: ListMirrorPackagesData["query"] = {},
  options: Omit<
    UseQueryOptions<
      AxiosResponse<ListMirrorPackagesResponse>,
      AxiosError<ApiError>
    >,
    "queryKey" | "queryFn"
  > = {},
) {
  const authFetchDebArchive = useFetchDebArchive();

  return useSuspenseQuery<
    AxiosResponse<ListMirrorPackagesResponse>,
    AxiosError<ApiError>
  >({
    queryKey: [`mirrorPackages`, mirrorName, params],
    queryFn: async () =>
      authFetchDebArchive.get(`${mirrorName}/packages`, { params }),
    ...options,
  });
}
