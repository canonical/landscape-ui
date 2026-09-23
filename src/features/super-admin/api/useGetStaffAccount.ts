import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import type { UseQueryOptions } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { StaffAccount } from "../types";

export const useGetStaffAccount = (
  name: string,
  options: Omit<
    UseQueryOptions<AxiosResponse<StaffAccount>, AxiosError<ApiError>>,
    "queryKey" | "queryFn"
  > = {},
) => {
  const authFetch = useFetch();

  const { data: response, isLoading } = useQuery<
    AxiosResponse<StaffAccount>,
    AxiosError<ApiError>
  >({
    queryKey: ["staffAccounts", name],
    queryFn: async () => authFetch.get(`accounts/${encodeURIComponent(name)}`),
    ...options,
  });

  return {
    staffAccount: response?.data ?? null,
    isGettingStaffAccount: isLoading,
  };
};
