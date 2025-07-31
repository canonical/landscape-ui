import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import type { InstanceChild } from "@/types/Instance";
import type { UseQueryOptions } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

interface GetInstanceChildrenResponse {
  children: InstanceChild[];
}

export interface GetInstanceChildrenParams {
  computer_id: number;
}

export const useGetInstanceChildren = (
  { computer_id }: GetInstanceChildrenParams,
  options?: Omit<
    UseQueryOptions<
      AxiosResponse<GetInstanceChildrenResponse>,
      AxiosError<ApiError>
    >,
    "queryKey" | "queryFn"
  >,
) => {
  const authFetch = useFetch();

  const {
    error,
    data: response,
    isLoading,
  } = useQuery<
    AxiosResponse<GetInstanceChildrenResponse>,
    AxiosError<ApiError>
  >({
    queryKey: ["instances", computer_id, "children"],
    queryFn: async () => authFetch.get(`computers/${computer_id}/children`),
    ...options,
  });

  return {
    instanceChildren: response?.data.children,
    instanceChildrenError: error,
    isLoadingInstanceChildren: isLoading,
  };
};
