import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import type { UseQueryOptions } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import { useSearchParams } from "react-router";

export interface GetOidcUrlParams {
  id?: number;
  external?: boolean;
  invitation_id?: string;
  return_to?: string;
  attach_code?: string;
}

interface GetOidcUrlParamsResponse {
  location: string;
}

export const useGetOidcUrlQuery = (
  queryParams: GetOidcUrlParams,
  config: Omit<
    UseQueryOptions<
      AxiosResponse<GetOidcUrlParamsResponse>,
      AxiosError<ApiError>
    >,
    "queryKey" | "queryFn"
  > = {},
) => {
  const authFetch = useFetch();
  const [searchParams] = useSearchParams();

  const isEmployeeLogin = searchParams.has("code");
  const url = isEmployeeLogin ? "employee-access/auth/start" : "auth/start";

  const { data, isLoading } = useQuery<
    AxiosResponse<GetOidcUrlParamsResponse>,
    AxiosError<ApiError>
  >({
    queryKey: ["oidcUrl", queryParams],
    queryFn: async () =>
      authFetch.get<GetOidcUrlParamsResponse>(url, {
        params: queryParams,
      }),
    ...config,
    gcTime: 0,
  });

  return {
    oidcUrlLocation: data?.data.location,
    isOidcUrlQueryLoading: isLoading,
  };
};
