import type {
  ListPublicationTargetsResponse,
  PublicationTarget,
} from "../types";
import useFetchDebArchive from "@/hooks/useFetchDebArchive";
import type { ApiError } from "@/types/api/ApiError";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";

interface UseGetPublicationTargetsReturnType {
  publicationTargets: PublicationTarget[];
  isGettingPublicationTargets: boolean;
}

const useGetPublicationTargets = (): UseGetPublicationTargetsReturnType => {
  const authFetchDebArchive = useFetchDebArchive();

  const { data, isLoading } = useQuery<
    PublicationTarget[],
    AxiosError<ApiError>
  >({
    queryKey: ["publicationTargets", "all"],
    queryFn: async () => {
      let pageToken: string | undefined;
      const publicationTargets: PublicationTarget[] = [];

      do {
        const response =
          await authFetchDebArchive.get<ListPublicationTargetsResponse>(
            "publicationTargets",
            {
              params: {
                pageSize: 100,
                pageToken,
              },
            },
          );

        publicationTargets.push(...(response.data.publicationTargets ?? []));
        pageToken = response.data.nextPageToken || undefined;
      } while (pageToken);

      return publicationTargets;
    },
  });

  return {
    publicationTargets: data ?? [],
    isGettingPublicationTargets: isLoading,
  };
};

export default useGetPublicationTargets;
