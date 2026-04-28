import useFetchDebArchive from "@/hooks/useFetchDebArchive";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type {
  Local,
  ListLocalsError,
  ListLocalsResponse,
} from "@canonical/landscape-openapi";

export const useGetLocalRepositories = (search?: string) => {
  const authFetchDebArchive = useFetchDebArchive();

  const { data, isPending } = useQuery<Local[], AxiosError<ListLocalsError>>({
    queryKey: ["locals", search],
    queryFn: async () => {
      let pageToken: string | undefined;
      const repositories: Local[] = [];

      do {
        const response = await authFetchDebArchive.get<ListLocalsResponse>(
          "locals",
          {
            params: {
              filter: search ? `display_name="${search}*"` : undefined,
              pageSize: 1000,
              pageToken,
            },
          },
        );

        repositories.push(...(response.data.locals ?? []));
        pageToken = response.data.nextPageToken;
      } while (pageToken);

      return repositories;
    },
  });

  return {
    repositories: data ?? [],
    isGettingRepositories: isPending,
  };
};
