import type {
  ListPublicationTargetsResponse,
  PublicationTarget,
} from "../types";
import useFetchDebArchive from "@/hooks/useFetchDebArchive";
import type { ApiError } from "@/types/api/ApiError";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";

const DEFAULT_PAGE_SIZE = 1000;
interface UseGetPublicationTargetsOptions {
  pageSize?: number;
}

export const useGetPublicationTargets = ({
  pageSize = DEFAULT_PAGE_SIZE,
}: UseGetPublicationTargetsOptions = {}) => {
  const authFetchDebArchive = useFetchDebArchive();

  const { data, isLoading } = useQuery<
    PublicationTarget[],
    AxiosError<ApiError>
  >({
    queryKey: ["publicationTargets", "all", pageSize],
    queryFn: async () => {
      const response =
        await authFetchDebArchive.get<ListPublicationTargetsResponse>(
          "publicationTargets",
          { params: { pageSize } },
        );

      return response.data.publicationTargets ?? [];
    },
  });

  return {
    publicationTargets: data ?? [],
    isGettingPublicationTargets: isLoading,
  };
};
