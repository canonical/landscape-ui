import useFetchDebArchive from "@/hooks/useFetchDebArchive";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type {
  ListLocalPackagesError,
  ListLocalPackagesResponse,
} from "@canonical/landscape-openapi";

export const useGetRepositoryPackages = (repository: string) => {
  const authFetchDebArchive = useFetchDebArchive();

  const { data, isPending } = useQuery<
    string[],
    AxiosError<ListLocalPackagesError>
  >({
    queryKey: ["packages", repository],
    queryFn: async () => {
      let pageToken: string | undefined;
      const packages: string[] = [];

      do {
        const response =
          await authFetchDebArchive.get<ListLocalPackagesResponse>(
            `${repository}/packages`,
            {
              params: {
                pageSize: 1000,
                pageToken,
              },
            },
          );

        packages.push(...(response.data.localPackages ?? []));
        pageToken = response.data.nextPageToken;
      } while (pageToken);

      return packages;
    },
  });

  return {
    packages: data ?? [],
    isGettingRepositoryPackages: isPending,
  };
};
