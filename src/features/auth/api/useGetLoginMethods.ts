import type { LoginMethods } from "@/features/auth";
import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import type { UseQueryOptions } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import { useSearchParams } from "react-router";

export const useGetLoginMethods = (
  config: Omit<
    UseQueryOptions<AxiosResponse<LoginMethods, AxiosError<ApiError>>>,
    "queryKey" | "queryFn"
  > = {},
) => {
  const authFetch = useFetch();
  const [searchParams] = useSearchParams();

  const isEmployeeLogin = searchParams.has("code");

  const url = isEmployeeLogin
    ? "employee-access/login/methods"
    : "login/methods";

  const { data, isLoading, isError } = useQuery<
    AxiosResponse<LoginMethods>,
    AxiosError<ApiError>
  >({
    queryKey: ["loginMethods"],
    queryFn: async () => authFetch.get<LoginMethods>(url),
    ...config,
  });

  return {
    loginMethods: data?.data ?? null,
    loginMethodsLoading: isLoading,
    isLoginMethodsError: isError,
  };
};
