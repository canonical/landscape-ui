import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { PublicationTarget, PublicationTargetWithPublications } from "../types";
import useGetPublications from "./useGetPublications";

interface GetPublicationTargetsResponse {
  publication_targets: PublicationTarget[];
}

interface GetPublicationTargetsParams {
  limit?: number;
  offset?: number;
  search?: string;
}

export default function useGetPublicationTargets(
  queryParams: GetPublicationTargetsParams = {},
) {
  const authFetch = useFetch();

  const { data, isLoading: isLoadingTargets } = useQuery<
    AxiosResponse<GetPublicationTargetsResponse>,
    AxiosError<ApiError>
  >({
    queryKey: ["publication-targets", queryParams],
    queryFn: async () =>
      authFetch.get("publicationTargets", { params: queryParams }),
  });

  const { publications, isGettingPublications } = useGetPublications();

  const targets = data?.data.publication_targets ?? [];

  const publicationTargets: PublicationTargetWithPublications[] = targets.map(
    (target) => ({
      ...target,
      publications: publications.filter(
        (p) => p.publication_target === target.name,
      ),
    }),
  );

  return {
    publicationTargets,
    isGettingPublicationTargets: isLoadingTargets || isGettingPublications,
  };
}
