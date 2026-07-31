import useFetchDebArchive from "@/hooks/useFetchDebArchive";
import type {
  MirrorServiceBatchGetMirrorsError,
  BatchGetMirrorsResponse,
} from "@canonical/landscape-openapi";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export const useBatchGetMirrors = (names: string[]) => {
  const authFetchDebArchive = useFetchDebArchive();

  const { data, isLoading } = useQuery<
    { lookup: Record<string, string>; unreachable: string[] },
    AxiosError<MirrorServiceBatchGetMirrorsError>
  >({
    queryKey: ["mirrors", "batch", names],
    queryFn: async () => {
      const response = await authFetchDebArchive.post<BatchGetMirrorsResponse>(
        "mirrors:batchGet",
        { names, returnPartialSuccess: true },
      );

      const lookup: Record<string, string> = {};
      const unreachable = response.data.unreachable ?? [];

      for (const mirror of response.data.mirrors ?? []) {
        if (mirror.name) {
          lookup[mirror.name] = mirror.displayName;
        }
      }
      return {
        lookup,
        unreachable,
      };
    },
    enabled: names.length > 0,
  });

  return {
    mirrorDisplayNames: data?.lookup ?? {},
    unreachableMirrors: data?.unreachable ?? [],
    isLoadingMirrorDisplayNames: isLoading,
  };
};
