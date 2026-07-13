import { DEFAULT_MODAL_PAGE_SIZE } from "@/constants";
import useFetchDebArchive from "@/hooks/useFetchDebArchive";
import type {
  MirrorServiceListMirrorPackagesError,
  MirrorServiceListMirrorPackagesResponse,
} from "@canonical/landscape-openapi";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import { useState } from "react";

interface UseListMirrorPackagesProps {
  readonly mirrorName: string;
  readonly pageSize?: number;
}

export const useListMirrorPackages = ({
  mirrorName,
  pageSize = DEFAULT_MODAL_PAGE_SIZE,
}: UseListMirrorPackagesProps) => {
  const authFetchDebArchive = useFetchDebArchive();

  // Stack of page tokens for visited pages. Empty means the first page; each
  // entry is the token used to fetch the page at that depth.
  const [pageTokenStack, setPageTokenStack] = useState<string[]>([]);
  const [trackedMirrorName, setTrackedMirrorName] = useState(mirrorName);

  // Reset pagination when the target mirror changes.
  if (trackedMirrorName !== mirrorName) {
    setTrackedMirrorName(mirrorName);
    setPageTokenStack([]);
  }

  const currentPageToken = pageTokenStack.at(-1);

  const { data, isPending, error } = useQuery<
    AxiosResponse<MirrorServiceListMirrorPackagesResponse>,
    AxiosError<MirrorServiceListMirrorPackagesError>
  >({
    queryKey: ["mirrorPackages", mirrorName, currentPageToken],
    queryFn: async () =>
      authFetchDebArchive.get(`${mirrorName}/packages`, {
        params: { pageSize, pageToken: currentPageToken },
      }),
  });

  const nextPageToken = data?.data.nextPageToken;

  const goToNextPage = () => {
    if (nextPageToken) {
      setPageTokenStack((stack) => [...stack, nextPageToken]);
    }
  };

  const goToPreviousPage = () => {
    setPageTokenStack((stack) => stack.slice(0, -1));
  };

  return {
    packages: data?.data.mirrorPackages ?? [],
    isGettingPackages: isPending,
    packagesError: error,
    currentPage: pageTokenStack.length + 1,
    hasNextPage: !!nextPageToken,
    hasPreviousPage: pageTokenStack.length > 0,
    goToNextPage,
    goToPreviousPage,
  };
};
