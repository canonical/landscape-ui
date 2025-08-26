import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import type { ApiPaginatedResponse } from "@/types/api/ApiPaginatedResponse";
import type { UseQueryOptions } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { Employee, GetEmployeesParams } from "../../types";
import type { PaginatedGetHookParams } from "@/types/api/PaginatedGetHookParams";
import usePageParams from "@/hooks/usePageParams";

const DEFAULT_CONFIG: PaginatedGetHookParams = {
  listenToUrlParams: true,
};

export const getStatus = (status: string) => {
  switch (status) {
    case "active":
      return true;
    case "inactive":
      return false;
    default:
      return undefined;
  }
};

const useGetEmployees = (
  config?: PaginatedGetHookParams,
  params?: GetEmployeesParams,
  options: Omit<
    UseQueryOptions<
      AxiosResponse<ApiPaginatedResponse<Employee>, AxiosError<ApiError>>
    >,
    "queryKey" | "queryFn"
  > = {},
) => {
  const authFetch = useFetch();
  const { currentPage, pageSize, search, status } = usePageParams();

  config = {
    ...DEFAULT_CONFIG,
    ...config,
  };

  const paramsWithPagination = {
    ...(config.listenToUrlParams
      ? {
          with_computers: true,
          is_active: getStatus(status),
          limit: pageSize,
          offset: (currentPage - 1) * pageSize,
          search: search ?? undefined,
        }
      : params),
  };

  const { data, isPending, isFetching } = useQuery<
    AxiosResponse<ApiPaginatedResponse<Employee>>,
    AxiosError<ApiError>
  >({
    queryKey: ["employees", paramsWithPagination, config],
    queryFn: async () =>
      authFetch.get("employees", { params: paramsWithPagination }),
    ...options,
  });

  return {
    employees: data?.data?.results || [],
    isPending,
    isFetching,
    count: data?.data?.count,
  };
};

export default useGetEmployees;
