import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import type { ApiPaginatedResponse } from "@/types/api/ApiPaginatedResponse";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { EmployeeGroup, GetEmployeeGroupsParams } from "../types";
import usePageParams from "@/hooks/usePageParams";
import type { PaginatedGetHookParams } from "@/types/api/PaginatedGetHookParams";

const DEFAULT_CONFIG: PaginatedGetHookParams = {
  listenToUrlParams: true,
};

export const useGetEmployeeGroups = (
  params: GetEmployeeGroupsParams = {},
  config?: PaginatedGetHookParams,
) => {
  const authFetch = useFetch();

  const {
    search,
    pageSize,
    currentPage,
    employeeGroups: employeeGroupIds,
    autoinstallFiles: autoinstallFileIds,
  } = usePageParams();

  config = {
    ...DEFAULT_CONFIG,
    ...config,
  };

  params = config.listenToUrlParams
    ? {
        search,
        limit: pageSize,
        offset: (currentPage - 1) * pageSize,
        employee_group_ids:
          employeeGroupIds.length > 0 ? employeeGroupIds : undefined,
        autoinstall_file_ids:
          autoinstallFileIds.length > 0 ? autoinstallFileIds : undefined,
        ...params,
      }
    : ({} as GetEmployeeGroupsParams);

  const { data, isPending } = useQuery<
    AxiosResponse<ApiPaginatedResponse<EmployeeGroup>>,
    AxiosError<ApiError>
  >({
    queryKey: ["employee_groups", params],
    queryFn: async () => authFetch.get("employee_groups", { params }),
  });

  return {
    employeeGroups: data?.data.results ?? [],
    employeeGroupsCount: data?.data.count,
    isEmployeeGroupsLoading: isPending,
  };
};
