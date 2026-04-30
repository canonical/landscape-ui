import useFetchDebArchive from "@/hooks/useFetchDebArchive";
import type {
  BatchGetPublicationTargetsError,
  BatchGetPublicationTargetsResponse,
} from "@canonical/landscape-openapi";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export const useBatchGetPublicationTargets = (names: string[]) => {
  const authFetchDebArchive = useFetchDebArchive();

  const { data, isLoading } = useQuery<
    Record<string, string>,
    AxiosError<BatchGetPublicationTargetsError>
  >({
    queryKey: ["publicationTargets", "batch", names],
    queryFn: async () => {
      const response =
        await authFetchDebArchive.post<BatchGetPublicationTargetsResponse>(
          "publicationTargets:batchGet",
          { names },
        );

      const lookup: Record<string, string> = {};
      for (const target of response.data.publicationTargets ?? []) {
        if (target.name) {
          lookup[target.name] = target.displayName;
        }
      }
      return lookup;
    },
    enabled: names.length > 0,
  });

  return {
    publicationTargetDisplayNames: data ?? {},
    isLoadingPublicationTargetDisplayNames: isLoading,
  };
};
