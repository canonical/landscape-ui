import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import type { Instance } from "@/types/Instance";
import type { UseQueryOptions } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

export interface GetInstanceParams {
  instanceId: number;
  with_annotations?: boolean;
  with_grouped_hardware?: boolean;
  with_hardware?: boolean;
  with_network?: boolean;
}

export const useGetInstance = (
  { instanceId, ...params }: GetInstanceParams,
  options?: Omit<
    UseQueryOptions<AxiosResponse<Instance>, AxiosError<ApiError>>,
    "queryKey" | "queryFn"
  >,
) => {
  const authFetch = useFetch();

  const { data: response, isLoading } = useQuery<
    AxiosResponse<Instance>,
    AxiosError<ApiError>
  >({
    queryKey: ["instances", instanceId, params],
    queryFn: async () => authFetch.get(`computers/${instanceId}`, { params }),
    ...options,
  });

  return {
    instance: response?.data,
    isGettingInstance: isLoading,
  };
};
