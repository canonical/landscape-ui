import useFetchDebArchive from "@/hooks/useFetchDebArchive";
import type {
  BatchGetOperationsRequest,
  OperationServiceBatchGetOperationsError,
} from "@canonical/landscape-openapi";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { Operation } from "../types";

type BatchGetOperationsReturnType = Record<string, Operation>;

// The generated Operation type only models the untyped LRO envelope; the local
// Operation type adds the discriminated done/response/error shape consumers rely on.
interface BatchGetOperationsResponse {
  operations?: Operation[] | undefined;
  unreachable?: string[];
}

export const useBatchGetOperations = (
  names: string[],
  config: Omit<
    UseQueryOptions<
      BatchGetOperationsReturnType,
      AxiosError<OperationServiceBatchGetOperationsError>
    >,
    "queryKey" | "queryFn"
  > = {},
) => {
  const authFetchDebArchive = useFetchDebArchive();

  const { data, isLoading } = useQuery<
    BatchGetOperationsReturnType,
    AxiosError<OperationServiceBatchGetOperationsError>
  >({
    queryKey: ["operations", "batch", names],
    queryFn: async () => {
      const requestBody: BatchGetOperationsRequest = {
        names,
        returnPartialSuccess: true,
      };

      const response =
        await authFetchDebArchive.post<BatchGetOperationsResponse>(
          "operations:batchGet",
          requestBody,
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
