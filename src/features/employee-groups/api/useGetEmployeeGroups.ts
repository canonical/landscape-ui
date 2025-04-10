import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/ApiError";
import type { ApiPaginatedResponse } from "@/types/ApiPaginatedResponse";
import type { UseQueryOptions } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { EmployeeGroup, GetEmployeeGroupsParams } from "../types";

export const useGetEmployeeGroups = (
  queryParams: GetEmployeeGroupsParams = {},
  config: Omit<
    UseQueryOptions<
      AxiosResponse<ApiPaginatedResponse<EmployeeGroup>, AxiosError<ApiError>>
    >,
    "queryKey" | "queryFn"
  > = {},
) => {
  const authFetch = useFetch();

  const { data, isPending } = useQuery<
    AxiosResponse<ApiPaginatedResponse<EmployeeGroup>>,
    AxiosError<ApiError>
  >({
    queryKey: ["employee_groups", queryParams],
    queryFn: () => authFetch.get("employee_groups", { params: queryParams }),
    ...config,
  });

  return {
    employeeGroups: data?.data.results ?? [],
    employeeGroupsCount: data?.data.count,
    isEmployeeGroupsLoading: isPending,
  };
};
