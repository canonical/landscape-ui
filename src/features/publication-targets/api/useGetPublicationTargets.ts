import type { PublicationTarget } from "../types/PublicationTarget";
import useFetchDebArchive from "@/hooks/useFetchDebArchive";
import type { ApiError } from "@/types/api/ApiError";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

interface UseGetPublicationTargetsReturnType {
  publicationTargets: PublicationTarget[];
  isGettingPublicationTargets: boolean;
}

export interface ListPublicationTargetsResponse {
  publicationTargets?: PublicationTarget[];
  nextPageToken?: string;
}

const useGetPublicationTargets = (): UseGetPublicationTargetsReturnType => {
  const authFetchDebArchive = useFetchDebArchive();

  const { data, isLoading } = useQuery<
    AxiosResponse<ListPublicationTargetsResponse>,
    AxiosError<ApiError>
  >({
    queryKey: ["publicationTargets", "all"],
    queryFn: async () =>
      await authFetchDebArchive.get("publicationTargets", {
        params: { pageSize: 100 },
      }),
  });

  return {
    publicationTargets: data?.data?.publicationTargets ?? [],
    isGettingPublicationTargets: isLoading,
  };
};

export default useGetPublicationTargets;
