import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import type { ApiPaginatedResponse } from "@/types/api/ApiPaginatedResponse";
import type { UseQueryOptions } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { Employee, GetEmployeesParams } from "../../types";

const useGetEmployees = (
  queryParams: GetEmployeesParams = {},
  config: Omit<
    UseQueryOptions<
      AxiosResponse<ApiPaginatedResponse<Employee>, AxiosError<ApiError>>
    >,
    "queryKey" | "queryFn"
  > = {},
) => {
  const authFetch = useFetch();

  const { data, isPending, isFetching } = useQuery<
    AxiosResponse<ApiPaginatedResponse<Employee>>,
    AxiosError<ApiError>
  >({
    queryKey: ["employees", queryParams],
    queryFn: () => authFetch.get("employees", { params: queryParams }),
    ...config,
  });

  return {
    employees: data?.data?.results || [],
    isPending,
    isFetching,
    count: data?.data?.count,
  };
};

export default useGetEmployees;
