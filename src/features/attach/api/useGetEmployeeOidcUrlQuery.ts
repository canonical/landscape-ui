import type { GetOidcUrlParams } from "@/features/auth";
import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import type { UseQueryOptions } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

export interface GetEmployeeOidcUrlParams extends GetOidcUrlParams {
  attach_code?: string;
}

interface GetOidcUrlParamsResponse {
  location: string;
}

const useGetEmployeeOidcUrlQuery = (
  queryParams: GetEmployeeOidcUrlParams,
  config: Omit<
    UseQueryOptions<
      AxiosResponse<GetOidcUrlParamsResponse>,
      AxiosError<ApiError>
    >,
    "queryKey" | "queryFn"
  > = {},
) => {
  const authFetch = useFetch();

  const { data, isPending } = useQuery<
    AxiosResponse<GetOidcUrlParamsResponse>,
    AxiosError<ApiError>
  >({
    queryKey: ["oidcUrl", queryParams],
    queryFn: async () =>
      authFetch.get("employee-access/auth/start", {
        params: queryParams,
      }),
    ...config,
    gcTime: 0,
  });

  return {
    data,
    isPending,
  };
};

export default useGetEmployeeOidcUrlQuery;
