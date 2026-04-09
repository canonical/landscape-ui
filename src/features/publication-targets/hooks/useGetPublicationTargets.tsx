import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { PublicationTarget } from "../types";

interface GetPublicationTargetsResponse {
  publication_targets: PublicationTarget[];
}

export const useGetPublicationTargets = () => {
  const authFetch = useFetch();

  const { data, isPending } = useQuery<
    AxiosResponse<GetPublicationTargetsResponse>,
    AxiosError<ApiError>
  >({
    queryKey: ["publicationTargets"],
    queryFn: () => authFetch.get("publicationTargets"),
  });

  return {
    publicationTargets: data?.data.publication_targets ?? [],
    isPublicationTargetsLoading: isPending,
  };
};
