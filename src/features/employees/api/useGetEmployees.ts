import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import type { ApiPaginatedResponse } from "@/types/api/ApiPaginatedResponse";
import type { UseQueryOptions } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { Employee } from "../types";
import usePageParams from "@/hooks/usePageParams";

const getStatus = (status: string) => {
  switch (status) {
    case "active":
      return true;
    case "inactive":
      return false;
    default:
      return undefined;
  }
};

export const useGetEmployees = (
  options: Omit<
    UseQueryOptions<
      AxiosResponse<ApiPaginatedResponse<Employee>, AxiosError<ApiError>>
    >,
    "queryKey" | "queryFn"
  > = {},
) => {
  const authFetch = useFetch();
  const { currentPage, pageSize, search, status } = usePageParams();

  const params = {
    with_computers: true,
    is_active: getStatus(status),
    limit: pageSize,
    offset: (currentPage - 1) * pageSize,
    search: search ?? undefined,
  };

  const { data, isPending, isFetching } = useQuery<
    AxiosResponse<ApiPaginatedResponse<Employee>>,
    AxiosError<ApiError>
  >({
    queryKey: ["employees", params],
    queryFn: async () => authFetch.get("employees", { params }),
    ...options,
  });

  return {
    employees: data?.data?.results || [],
    isPending,
    isFetching,
    count: data?.data?.count,
  };
};
