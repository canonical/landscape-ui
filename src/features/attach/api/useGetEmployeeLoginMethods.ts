import type { LoginMethods } from "@/features/auth";
import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import type { UseQueryOptions } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

const useGetEmployeeLoginMethods = (
  config: Omit<
    UseQueryOptions<AxiosResponse<LoginMethods, AxiosError<ApiError>>>,
    "queryKey" | "queryFn"
  > = {},
) => {
  const authFetch = useFetch();

  const { data, isLoading, isError } = useQuery<
    AxiosResponse<LoginMethods>,
    AxiosError<ApiError>
  >({
    queryKey: ["employeeLoginMethods"],
    queryFn: async () =>
      authFetch.get<LoginMethods>("employee-access/login/methods"),
    ...config,
  });

  return {
    data,
    isLoading,
    isError,
  };
};

export default useGetEmployeeLoginMethods;
