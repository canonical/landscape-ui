import useFetchDebArchive from "@/hooks/useFetchDebArchive";
import type {
  MirrorServiceListMirrorPackagesError,
  MirrorServiceListMirrorPackagesResponse,
} from "@canonical/landscape-openapi";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import { COUNT_PAGE_SIZE } from "@/features/repositories";

interface UseGetMirrorPackagesCountProps {
  readonly mirrorName: string;
}

export const useGetMirrorPackagesCount = ({
  mirrorName,
}: UseGetMirrorPackagesCountProps) => {
  const authFetchDebArchive = useFetchDebArchive();

  const { data, isPending, isError } = useQuery<
    AxiosResponse<MirrorServiceListMirrorPackagesResponse>,
    AxiosError<MirrorServiceListMirrorPackagesError>
  >({
    queryKey: ["mirrorPackages", "count", mirrorName],
    queryFn: async () =>
      authFetchDebArchive.get(`${mirrorName}/packages`, {
        params: { pageSize: COUNT_PAGE_SIZE },
      }),
  });

  return {
    mirrorPackagesCount: data?.data.mirrorPackages?.length ?? 0,
    isPackagesCountExact: !data?.data.nextPageToken,
    isGettingPackagesCount: isPending,
    isPackagesCountError: isError,
  };
};
