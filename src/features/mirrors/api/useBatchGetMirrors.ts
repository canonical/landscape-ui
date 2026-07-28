import useFetchDebArchive from "@/hooks/useFetchDebArchive";
import useDebug from "@/hooks/useDebug";
import type {
  MirrorServiceBatchGetMirrorsError,
  BatchGetMirrorsResponse,
} from "@canonical/landscape-openapi";
import { pluralize } from "@/utils/_helpers";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export const useBatchGetMirrors = (names: string[]) => {
  const authFetchDebArchive = useFetchDebArchive();
  const debug = useDebug();

  const { data, isLoading } = useQuery<
    { lookup: Record<string, string>; unreachable: string[] },
    AxiosError<MirrorServiceBatchGetMirrorsError>
  >({
    queryKey: ["mirrors", "batch", names],
    queryFn: async () => {
      const response = await authFetchDebArchive.post<BatchGetMirrorsResponse>(
        "mirrors:batchGet",
        { names, return_partial_success: true },
      );

      const lookup: Record<string, string> = {};
      const unreachable = response.data.unreachable ?? [];
      if (unreachable.length > 0) {
        debug(
          new Error(
            `Failed to fetch ${pluralize(unreachable.length, ["mirror"])}: ${unreachable.join(", ")}`,
          ),
        );
      }

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
