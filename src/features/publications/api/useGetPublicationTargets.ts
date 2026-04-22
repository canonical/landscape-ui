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

const FETCH_PAGE_SIZE = 1000;
// TODO: remove
const useGetPublicationTargets = (): UseGetPublicationTargetsReturnType => {
  const authFetchDebArchive = useFetchDebArchive();

  const { data, isLoading } = useQuery<
    PublicationTarget[],
    AxiosError<ApiError>
  >({
    queryKey: ["publicationTargets", "all"],
    queryFn: async () => {
      const response =
        await authFetchDebArchive.get<ListPublicationTargetsResponse>(
          "publicationTargets",
          { params: { pageSize: FETCH_PAGE_SIZE } },
        );

      return response.data.publicationTargets ?? [];
    },
  });

  return {
    publicationTargets: data ?? [],
    isGettingPublicationTargets: isLoading,
  };
};

export default useGetPublicationTargets;
