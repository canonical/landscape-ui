import useFetchDebArchive from "@/hooks/useFetchDebArchive";
import type {
  LocalServiceListLocalPackagesError,
  LocalServiceListLocalPackagesResponse,
} from "@canonical/landscape-openapi";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import { COUNT_PAGE_SIZE } from "@/features/repositories";

interface UseGetRepositoryPackagesCountProps {
  readonly local: string;
}

export const useGetRepositoryPackagesCount = ({
  local,
}: UseGetRepositoryPackagesCountProps) => {
  const authFetchDebArchive = useFetchDebArchive();

  const { data, isPending, isError } = useQuery<
    AxiosResponse<LocalServiceListLocalPackagesResponse>,
    AxiosError<LocalServiceListLocalPackagesError>
  >({
    queryKey: ["localPackages", "count", local],
    queryFn: async () =>
      authFetchDebArchive.get(`${local}/packages`, {
        params: { pageSize: COUNT_PAGE_SIZE },
      }),
  });

  return {
    localPackagesCount: data?.data.localPackages?.length ?? 0,
    isPackagesCountExact: !data?.data.nextPageToken,
    isGettingPackagesCount: isPending,
    isPackagesCountError: isError,
  };
};
