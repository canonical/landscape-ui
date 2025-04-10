import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/ApiError";
import type { ApiPaginatedResponse } from "@/types/ApiPaginatedResponse";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { EmployeeGroup, GetEmployeeGroupsParams } from "../types";
import usePageParams from "@/hooks/usePageParams";

export const useGetEmployeeGroups = (
  queryParams: GetEmployeeGroupsParams = {},
) => {
  const authFetch = useFetch();

  const {
    search,
    pageSize,
    currentPage,
    employeeGroups: employeeGroupIds,
    autoinstallFiles: autoinstallFileIds,
  } = usePageParams();

  const params = {
    search,
    limit: pageSize,
    offset: (currentPage - 1) * pageSize,
    employee_group_ids:
      employeeGroupIds.length > 0 ? employeeGroupIds : undefined,
    autoinstall_file_ids:
      autoinstallFileIds.length > 0 ? autoinstallFileIds : undefined,
    ...queryParams,
  };

  const { data, isLoading } = useQuery<
    AxiosResponse<ApiPaginatedResponse<EmployeeGroup>>,
    AxiosError<ApiError>
  >({
    queryKey: ["employee_groups", params],
    queryFn: async () => authFetch.get("employee_groups", { params }),
  });

  return {
    employeeGroups: data?.data.results ?? [],
    employeeGroupsCount: data?.data.count,
    isEmployeeGroupsLoading: isLoading,
  };
};
