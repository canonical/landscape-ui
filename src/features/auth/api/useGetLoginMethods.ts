import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import axios from "axios";
import { useSearchParams } from "react-router";

import { API_URL } from "@/constants";
import type { LoginMethods } from "@/features/auth";
import type { ApiError } from "@/types/api/ApiError";

const publicFetch = axios.create({ baseURL: API_URL });

export const useGetLoginMethods = (
  config: Omit<
    UseQueryOptions<AxiosResponse<LoginMethods>, AxiosError<ApiError>>,
    "queryKey" | "queryFn"
  > = {},
) => {
  const [searchParams] = useSearchParams();

  const isEmployeeLogin = searchParams.has("code");
  const url = isEmployeeLogin
    ? "employee-access/login/methods"
    : "login/methods";

  const { data, isLoading, isError, error } = useQuery<
    AxiosResponse<LoginMethods>,
    AxiosError<ApiError>
  >({
    queryKey: ["loginMethods", { isEmployeeLogin }],
    queryFn: async () => publicFetch.get<LoginMethods>(url),
    ...config,
  });

  return {
    loginMethods: data?.data ?? null,
    loginMethodsLoading: isLoading,
    isLoginMethodsError: isError,
    error,
  };
};
