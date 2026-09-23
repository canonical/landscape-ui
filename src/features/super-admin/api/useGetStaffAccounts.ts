import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import type { ApiPaginatedResponse } from "@/types/api/ApiPaginatedResponse";
import type { UseQueryOptions } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { StaffAccountListItem } from "../types";

export interface GetStaffAccountsParams {
  search?: string;
  limit?: number;
  offset?: number;
}

export const useGetStaffAccounts = (
  params: GetStaffAccountsParams = {},
  options: Omit<
    UseQueryOptions<
      AxiosResponse<ApiPaginatedResponse<StaffAccountListItem>>,
      AxiosError<ApiError>
    >,
    "queryKey" | "queryFn"
  > = {},
) => {
  const authFetch = useFetch();

  const queryParams = { ...params, search: params.search || undefined };

  const { data: response, isLoading } = useQuery<
    AxiosResponse<ApiPaginatedResponse<StaffAccountListItem>>,
    AxiosError<ApiError>
  >({
    queryKey: ["staffAccounts", queryParams],
    queryFn: async () => authFetch.get("accounts", { params: queryParams }),
    ...options,
  });

  return {
    staffAccounts: response?.data.results ?? [],
    staffAccountsCount: response?.data.count ?? 0,
    isGettingStaffAccounts: isLoading,
  };
};
