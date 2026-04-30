import useFetchDebArchive from "@/hooks/useFetchDebArchive";
import type {
  BatchGetLocalsError,
  BatchGetLocalsResponse,
} from "@canonical/landscape-openapi";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export const useBatchGetLocals = (names: string[]) => {
  const authFetchDebArchive = useFetchDebArchive();

  const { data, isLoading } = useQuery<
    Record<string, string>,
    AxiosError<BatchGetLocalsError>
  >({
    queryKey: ["locals", "batch", names],
    queryFn: async () => {
      const response = await authFetchDebArchive.post<BatchGetLocalsResponse>(
        "locals:batchGet",
        { names },
      );

      const lookup: Record<string, string> = {};
      for (const local of response.data.locals ?? []) {
        if (local.name) {
          lookup[local.name] = local.displayName;
        }
      }
      return lookup;
    },
    enabled: names.length > 0,
  });

  return {
    localDisplayNames: data ?? {},
    isLoadingLocalDisplayNames: isLoading,
  };
};
