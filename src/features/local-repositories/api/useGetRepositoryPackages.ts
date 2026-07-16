import { DEFAULT_MODAL_PAGE_SIZE } from "@/constants";
import useFetchDebArchive from "@/hooks/useFetchDebArchive";
import useTokenPagination from "@/hooks/useTokenPagination";
import type {
  LocalServiceListLocalPackagesError,
  LocalServiceListLocalPackagesResponse,
} from "@canonical/landscape-openapi";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

interface UseGetRepositoryPackagesProps {
  readonly local: string;
  readonly pageSize?: number;
}

export const useGetRepositoryPackages = ({
  local,
  pageSize = DEFAULT_MODAL_PAGE_SIZE,
}: UseGetRepositoryPackagesProps) => {
  const authFetchDebArchive = useFetchDebArchive();

  const { currentPageToken, hasPreviousPage, pushNextPage, goToPreviousPage } =
    useTokenPagination(local);

  const { data, isLoading, error } = useQuery<
    AxiosResponse<LocalServiceListLocalPackagesResponse>,
    AxiosError<LocalServiceListLocalPackagesError>
  >({
    queryKey: ["localPackages", local, currentPageToken, pageSize],
    queryFn: async () =>
      authFetchDebArchive.get(`${local}/packages`, {
        params: { pageSize, pageToken: currentPageToken },
      }),
    enabled: !!local,
  });

  const nextPageToken = data?.data.nextPageToken;

  return {
    packages: data?.data.localPackages ?? [],
    isGettingPackages: isLoading,
    packagesError: error,
    hasNextPage: !!nextPageToken,
    hasPreviousPage,
    goToNextPage: () => {
      pushNextPage(nextPageToken);
    },
    goToPreviousPage,
  };
};
