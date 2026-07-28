import useFetchDebArchive from "@/hooks/useFetchDebArchive";
import useDebug from "@/hooks/useDebug";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { pluralize } from "@/utils/_helpers";
import type { Operation } from "../types";

type BatchGetOperationsReturnType = Record<string, Operation>;

interface BatchGetOperationsResponse {
  operations?: Operation[] | undefined;
  unreachable?: string[];
}
export const useBatchGetOperations = (
  names: string[],
  config: Omit<
    UseQueryOptions<BatchGetOperationsReturnType>,
    "queryKey" | "queryFn"
  > = {},
) => {
  const authFetchDebArchive = useFetchDebArchive();
  const debug = useDebug();

  const { data, isLoading } = useQuery<BatchGetOperationsReturnType>({
    queryKey: ["operations", "batch", names],
    queryFn: async () => {
      const response =
        await authFetchDebArchive.post<BatchGetOperationsResponse>(
          "operations:batchGet",
          { names, return_partial_success: true },
        );

      const lookup: Record<string, Operation> = {};
      for (const operation of response.data.operations ?? []) {
        if (operation.name) {
          lookup[operation.name] = operation;
        }
      }

      const unreachable = response.data.unreachable ?? [];
      if (unreachable.length > 0) {
        debug(
          new Error(
            `Failed to fetch ${pluralize(unreachable.length, ["operation"])}: ${unreachable.join(", ")}`,
          ),
        );
      }

      return lookup;
    },
    enabled: names.length > 0,
    ...config,
  });

  return {
    operations: data ?? {},
    isGettingOperations: isLoading,
  };
};
