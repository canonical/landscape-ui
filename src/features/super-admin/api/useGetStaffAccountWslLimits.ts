import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import type { UseQueryOptions } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { WslFeatureLimits } from "../types";

/** Gets the WSL feature limits of the account named `name`; idle while `name` is empty. */
export const useGetStaffAccountWslLimits = (
  name: string,
  options: Omit<
    UseQueryOptions<AxiosResponse<WslFeatureLimits>, AxiosError<ApiError>>,
    "queryKey" | "queryFn" | "enabled"
  > = {},
) => {
  const authFetch = useFetch();

  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useQuery<AxiosResponse<WslFeatureLimits>, AxiosError<ApiError>>({
    queryKey: ["staffAccountWslLimits", name],
    queryFn: async () =>
      authFetch.get(`accounts/${encodeURIComponent(name)}/wsl-feature-limits`),
    enabled: !!name,
    ...options,
  });

  return {
    wslLimits: response?.data ?? null,
    wslLimitsError: error,
    isGettingWslLimits: isLoading,
    isWslLimitsError: isError,
  };
};
