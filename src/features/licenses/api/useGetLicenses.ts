import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { License } from "../types";

interface GetLicensesResponse {
  results: License[];
}

export const useGetLicenses = (
  config: Omit<
    UseQueryOptions<AxiosResponse<GetLicensesResponse>, AxiosError<ApiError>>,
    "queryKey" | "queryFn"
  > = {},
) => {
  const authFetch = useFetch();

  const {
    data: response,
    isPending,
    error,
  } = useQuery<AxiosResponse<GetLicensesResponse>, AxiosError<ApiError>>({
    queryKey: ["licenses"],
    queryFn: async () => authFetch.get("legacy-licenses"),
    ...config,
  });

  return {
    licenses: response?.data.results ?? [],
    licensesError: error,
    isGettingLicenses: isPending,
  };
};
