import useFetchDebArchive from "@/hooks/useFetchDebArchive";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { GetOperationError } from "@canonical/landscape-openapi";
import type { Operation } from "../types";

export const useGetOperation = (
  name: string,
  config: Omit<
    UseQueryOptions<AxiosResponse<Operation>, AxiosError<GetOperationError>>,
    "queryKey" | "queryFn"
  > = {},
) => {
  const authFetchDebArchive = useFetchDebArchive();

  const {
    data: response,
    isPending,
    error,
  } = useQuery<AxiosResponse<Operation>, AxiosError<GetOperationError>>({
    queryKey: ["local", name],
    queryFn: async () => authFetchDebArchive.get(name),
    ...config,
  });

  return {
    operation: response?.data,
    operationError:
      response && !response.data
        ? new Error("The operation could not be found.")
        : error,
    isGettingOperation: isPending,
  };
};
