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
    Record<string, string>,
    AxiosError<MirrorServiceBatchGetMirrorsError>
  >({
    queryKey: ["mirrors", "batch", names],
    queryFn: async () => {
      const response = await authFetchDebArchive.post<BatchGetMirrorsResponse>(
        "mirrors:batchGet",
        { names },
      );

      const lookup: Record<string, string> = {};
      for (const mirror of response.data.mirrors ?? []) {
        if (mirror.name) {
          lookup[mirror.name] = mirror.displayName;
        }
      }
      return lookup;
    },
    enabled: names.length > 0,
  });

  return {
    mirrorDisplayNames: data ?? {},
    isLoadingMirrorDisplayNames: isLoading,
  };
};
