import useFetchDebArchive from "@/hooks/useFetchDebArchive";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { Operation } from "../types";

type BatchGetOperationsReturnType = Record<string, Operation>;

interface BatchGetOperationsResponse {
  operations?: Operation[] | undefined;
}
export const useBatchGetOperations = (
  names: string[],
  config: Omit<
    UseQueryOptions<BatchGetOperationsReturnType>,
    "queryKey" | "queryFn"
  > = {},
) => {
  const authFetchDebArchive = useFetchDebArchive();

  const { data, isLoading } = useQuery<BatchGetOperationsReturnType>({
    queryKey: ["operations", "batch", names],
    queryFn: async () => {
      const response =
        await authFetchDebArchive.post<BatchGetOperationsResponse>(
          "operations:batchGet",
          { names },
        );

      const lookup: Record<string, Operation> = {};
      for (const operation of response.data.operations ?? []) {
        if (operation.name) {
          lookup[operation.name] = operation;
        }
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
