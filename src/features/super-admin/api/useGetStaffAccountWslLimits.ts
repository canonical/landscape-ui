import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import type { UseQueryOptions } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { WslFeatureLimits } from "../types";

export const useGetStaffAccountWslLimits = (
  name: string,
  options: Omit<
    UseQueryOptions<AxiosResponse<WslFeatureLimits>, AxiosError<ApiError>>,
    "queryKey" | "queryFn"
  > = {},
) => {
  const authFetch = useFetch();

  const { data: response, isLoading } = useQuery<
    AxiosResponse<WslFeatureLimits>,
    AxiosError<ApiError>
  >({
    queryKey: ["staffAccounts", name, "wslLimits"],
    queryFn: async () =>
      authFetch.get(`accounts/${encodeURIComponent(name)}/wsl-feature-limits`),
    ...options,
  });

  return {
    wslLimits: response?.data ?? null,
    isGettingWslLimits: isLoading,
  };
};
