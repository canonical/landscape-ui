import useFetchDebArchive from "@/hooks/useFetchDebArchive";
import type {
  BatchGetLocalsResponse,
  LocalServiceBatchGetLocalsError,
} from "@canonical/landscape-openapi";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export const useBatchGetLocals = (names: string[]) => {
  const authFetchDebArchive = useFetchDebArchive();

  const { data, isLoading } = useQuery<
    { lookup: Record<string, string>; unreachable: string[] },
    AxiosError<LocalServiceBatchGetLocalsError>
  >({
    queryKey: ["locals", "batch", names],
    queryFn: async () => {
      const response = await authFetchDebArchive.post<BatchGetLocalsResponse>(
        "locals:batchGet",
        { names, returnPartialSuccess: true },
      );

      const lookup: Record<string, string> = {};
      const unreachable = response.data.unreachable ?? [];
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
