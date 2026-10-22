import useFetchOld from "@/hooks/useFetchOld";
import type { ApiError } from "@/types/api/ApiError";
import type { PendingInstance } from "@/types/Instance";
import type { UseQueryOptions } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import { HttpStatusCode, isAxiosError } from "axios";

export const useGetPendingInstances = (
  _params?: undefined,
  options?: Omit<
    UseQueryOptions<
      AxiosResponse<PendingInstance[]> | null,
      AxiosError<ApiError>
    >,
    "queryKey" | "queryFn"
  >,
) => {
  const authFetchOld = useFetchOld();

  const {
    data: response,
    isPending,
    error,
  } = useQuery<AxiosResponse<PendingInstance[]> | null, AxiosError<ApiError>>({
    queryKey: ["pendingInstances"],
    queryFn: async () => {
      try {
        return await authFetchOld.get<PendingInstance[]>("GetPendingComputers");
      } catch (error) {
        // Admins without permission to manage pending instances get a 403;
        // resolve instead of erroring so no error notification is shown.
        if (
          isAxiosError(error) &&
          error.response?.status === HttpStatusCode.Forbidden
        ) {
          return null;
        }

        throw error;
      }
    },
    ...options,
  });

  return {
    pendingInstances: response?.data ?? [],
    isGettingPendingInstances: isPending,
    pendingInstancesError: error,
    isPendingInstancesForbidden: response === null,
  };
};
