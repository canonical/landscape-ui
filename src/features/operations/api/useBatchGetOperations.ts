import useFetchDebArchive from "@/hooks/useFetchDebArchive";
import type { ApiError } from "@/types/api/ApiError";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { isAxiosError, type AxiosError } from "axios";
import type { Operation } from "../types";

type BatchGetOperationsReturnType = Record<string, Operation>;

interface BatchGetOperationsResponse {
  operations?: Operation[] | undefined;
}
export const useBatchGetOperations = (
  names: string[],
  config: Omit<
    UseQueryOptions<BatchGetOperationsReturnType, AxiosError<ApiError>>,
    "queryKey" | "queryFn"
  > = {},
) => {
  const authFetchDebArchive = useFetchDebArchive();

  const { data, isLoading } = useQuery<
    BatchGetOperationsReturnType,
    AxiosError<ApiError>
  >({
    queryKey: ["operations", "batch", names],
    queryFn: async () => {
      try {
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
      } catch (error) {
        if (isAxiosError(error) && error.response?.status === 404) {
          // BatchGet fails whole request when one operation is missing.
          // Fall back to per-operation GETs so existing rows still render status.
          const responses = await Promise.allSettled(
            names.map((name) => authFetchDebArchive.get<Operation>(name)),
          );

          const lookup: Record<string, Operation> = {};
          for (const response of responses) {
            if (response.status === "fulfilled" && response.value.data.name) {
              lookup[response.value.data.name] = response.value.data;
            }
          }

          if (Object.keys(lookup).length > 0) {
            return lookup;
          }

          throw error;
        }

        throw error;
      }
    },
    enabled: names.length > 0,
    ...config,
  });

  return {
    operations: data ?? {},
    isGettingOperations: isLoading,
  };
};
