import useFetchDebArchive from "@/hooks/useFetchDebArchive";
import useDebug from "@/hooks/useDebug";
import type {
  BatchGetLocalsResponse,
  LocalServiceBatchGetLocalsError,
} from "@canonical/landscape-openapi";
import { pluralize } from "@/utils/_helpers";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export const useBatchGetLocals = (names: string[]) => {
  const authFetchDebArchive = useFetchDebArchive();
  const debug = useDebug();

  const { data, isLoading } = useQuery<
    { lookup: Record<string, string>; unreachable: string[] },
    AxiosError<LocalServiceBatchGetLocalsError>
  >({
    queryKey: ["locals", "batch", names],
    queryFn: async () => {
      const response = await authFetchDebArchive.post<BatchGetLocalsResponse>(
        "locals:batchGet",
        { names, return_partial_success: true },
      );

      const lookup: Record<string, string> = {};
      const unreachable = response.data.unreachable ?? [];
      if (unreachable.length > 0) {
        debug(
          new Error(
            `Failed to fetch ${pluralize(unreachable.length, ["local"])}: ${unreachable.join(", ")}`,
          ),
        );
      }
      for (const local of response.data.locals ?? []) {
        if (local.name) {
          lookup[local.name] = local.displayName;
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
    localDisplayNames: data?.lookup ?? {},
    unreachableLocals: data?.unreachable ?? [],
    isLoadingLocalDisplayNames: isLoading,
  };
};
