import { DEFAULT_MODAL_PAGE_SIZE } from "@/constants";
import useFetchDebArchive from "@/hooks/useFetchDebArchive";
import useTokenPagination from "@/hooks/useTokenPagination";
import type {
  MirrorServiceListMirrorPackagesError,
  MirrorServiceListMirrorPackagesResponse,
} from "@canonical/landscape-openapi";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

interface UseListMirrorPackagesProps {
  readonly mirrorName: string;
  readonly pageSize?: number;
}

export const useListMirrorPackages = ({
  mirrorName,
  pageSize = DEFAULT_MODAL_PAGE_SIZE,
}: UseListMirrorPackagesProps) => {
  const authFetchDebArchive = useFetchDebArchive();

  const {
    currentPageToken,
    currentPage,
    hasPreviousPage,
    pushNextPage,
    goToPreviousPage,
  } = useTokenPagination(mirrorName);

  const { data, isPending, error } = useQuery<
    AxiosResponse<MirrorServiceListMirrorPackagesResponse>,
    AxiosError<MirrorServiceListMirrorPackagesError>
  >({
    queryKey: ["mirrorPackages", mirrorName, currentPageToken, pageSize],
    queryFn: async () =>
      authFetchDebArchive.get(`${mirrorName}/packages`, {
        params: { pageSize, pageToken: currentPageToken },
      }),
  });

  const nextPageToken = data?.data.nextPageToken;

  return {
    packages: data?.data.mirrorPackages ?? [],
    isGettingPackages: isPending,
    packagesError: error,
    currentPage,
    hasNextPage: !!nextPageToken,
    hasPreviousPage,
    goToNextPage: () => {
      pushNextPage(nextPageToken);
    },
    goToPreviousPage,
  };
};
