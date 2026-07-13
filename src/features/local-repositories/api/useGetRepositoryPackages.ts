import { DEFAULT_MODAL_PAGE_SIZE } from "@/constants";
import useFetchDebArchive from "@/hooks/useFetchDebArchive";
import type {
  LocalServiceListLocalPackagesError,
  LocalServiceListLocalPackagesResponse,
} from "@canonical/landscape-openapi";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import { useState } from "react";

interface UseGetRepositoryPackagesProps {
  readonly local: string;
  readonly pageSize?: number;
}

export const useGetRepositoryPackages = ({
  local,
  pageSize = DEFAULT_MODAL_PAGE_SIZE,
}: UseGetRepositoryPackagesProps) => {
  const authFetchDebArchive = useFetchDebArchive();

  // Stack of page tokens for visited pages. Empty means the first page; each
  // entry is the token used to fetch the page at that depth.
  const [pageTokenStack, setPageTokenStack] = useState<string[]>([]);
  const [trackedLocal, setTrackedLocal] = useState(local);

  // Reset pagination when the target repository changes.
  if (trackedLocal !== local) {
    setTrackedLocal(local);
    setPageTokenStack([]);
  }

  const currentPageToken = pageTokenStack.at(-1);

  const { data, isPending, error } = useQuery<
    AxiosResponse<LocalServiceListLocalPackagesResponse>,
    AxiosError<LocalServiceListLocalPackagesError>
  >({
    queryKey: ["localPackages", local, currentPageToken],
    queryFn: async () =>
      authFetchDebArchive.get(`${local}/packages`, {
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
    packages: data?.data.localPackages ?? [],
    isGettingPackages: isPending,
    packagesError: error,
    currentPage: pageTokenStack.length + 1,
    hasNextPage: !!nextPageToken,
    hasPreviousPage: pageTokenStack.length > 0,
    goToNextPage,
    goToPreviousPage,
  };
};
