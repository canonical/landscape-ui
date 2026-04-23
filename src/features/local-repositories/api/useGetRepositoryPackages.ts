import useFetchDebArchive from "@/hooks/useFetchDebArchive";
import type { ApiError } from "@/types/api/ApiError";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";

interface ListLocalPackagesResponse {
  local_packages: string[];
  next_page_token: string;
}

export const useGetRepositoryPackages = (repository: string) => {
  const authFetchDebArchive = useFetchDebArchive();

  const { data, isPending } = useQuery<string[], AxiosError<ApiError>>({
    queryKey: ["packages", repository],
    queryFn: async () => {
      let page_token: string | undefined;
      const packages: string[] = [];

      do {
        const response =
          await authFetchDebArchive.get<ListLocalPackagesResponse>(
            `${repository}/packages`,
            {
              params: {
                page_size: 1000,
                page_token,
              },
            },
          );

        packages.push(...(response.data.local_packages ?? []));
        page_token = response.data.next_page_token;
      } while (page_token);

      return packages;
    },
  });

  return {
    packages: data?.map((name) => ({ name: name })) ?? [],
    isGettingRepositoryPackages: isPending,
  };
};
