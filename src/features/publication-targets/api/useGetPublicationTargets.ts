import useFetchDebArchive from "@/hooks/useFetchDebArchive";
import type { ApiError } from "@/types/api/ApiError";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type {
  ListPublicationTargetsResponse,
  PublicationTarget,
} from "@/api/generated/debArchive.schemas";
import type { PublicationTargetWithPublications } from "../types";
import useGetPublications from "./useGetPublications";

export default function useGetPublicationTargets() {
  const authFetchDebArchive = useFetchDebArchive();

  const { data, isLoading: isLoadingTargets } = useQuery<
    PublicationTarget[],
    AxiosError<ApiError>
  >({
    queryKey: ["publication-targets", "all"],
    queryFn: async () => {
      let pageToken: string | undefined;
      const targets: PublicationTarget[] = [];

      do {
        const response =
          await authFetchDebArchive.get<ListPublicationTargetsResponse>(
            "publicationTargets",
            { params: { pageSize: 100, pageToken } },
          );

        targets.push(...(response.data.publicationTargets ?? []));
        pageToken = response.data.nextPageToken || undefined;
      } while (pageToken);

      return targets;
    },
  });

  const { publications, isGettingPublications } = useGetPublications();

  const targets = data ?? [];

  const publicationTargets: PublicationTargetWithPublications[] = targets.map(
    (target) => ({
      ...target,
      publications: publications.filter(
        (p) => p.publicationTarget === target.name,
      ),
    }),
  );

  return {
    publicationTargets,
    isGettingPublicationTargets: isLoadingTargets || isGettingPublications,
  };
}
