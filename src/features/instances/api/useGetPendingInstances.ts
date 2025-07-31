import useFetchOld from "@/hooks/useFetchOld";
import type { ApiError } from "@/types/api/ApiError";
import type { PendingInstance } from "@/types/Instance";
import type { UseQueryOptions } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

export const useGetPendingInstances = (
  _params?: undefined,
  options?: Omit<
    UseQueryOptions<AxiosResponse<PendingInstance[]>, AxiosError<ApiError>>,
    "queryKey" | "queryFn"
  >,
) => {
  const authFetchOld = useFetchOld();

  const {
    data: response,
    isPending,
    error,
  } = useQuery<AxiosResponse<PendingInstance[]>, AxiosError<ApiError>>({
    queryKey: ["pendingInstances"],
    queryFn: async () => authFetchOld.get("GetPendingComputers"),
    ...options,
  });

  return {
    pendingInstances: response?.data ?? [],
    isGettingPendingInstances: isPending,
    pendingInstancesError: error,
  };
};
