import useFetchDebArchive from "@/hooks/useFetchDebArchive";
import { useQuery } from "@tanstack/react-query";
import type { Operation } from "../types";

interface BatchGetOperationsResponse {
  operations?: Operation[] | undefined;
}
export const useBatchGetOperations = (names: string[]) => {
  const authFetchDebArchive = useFetchDebArchive();

  const { data, isLoading } = useQuery<Record<string, Operation>>({
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
  });

  return {
    operations: data ?? {},
    isGettingOperations: isLoading,
  };
};
