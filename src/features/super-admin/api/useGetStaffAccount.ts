import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import type { UseQueryOptions } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { StaffAccount } from "../types";

/** Gets the account named `name`; idle while `name` is empty. */
export const useGetStaffAccount = (
  name: string,
  options: Omit<
    UseQueryOptions<AxiosResponse<StaffAccount>, AxiosError<ApiError>>,
    "queryKey" | "queryFn" | "enabled"
  > = {},
) => {
  const authFetch = useFetch();

  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useQuery<AxiosResponse<StaffAccount>, AxiosError<ApiError>>({
    queryKey: ["staffAccounts", name],
    queryFn: async () => authFetch.get(`accounts/${encodeURIComponent(name)}`),
    enabled: !!name,
    ...options,
  });

  return {
    staffAccount: response?.data ?? null,
    staffAccountError: error,
    isGettingStaffAccount: isLoading,
    isStaffAccountError: isError,
  };
};
