import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import type { UseQueryOptions } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { Package } from "../types";
import type { FilterState } from "../types/FilterState";

export interface SearchUpgradesRequest {
  computer_query: string;
  text?: string;
  names?: string[];
  security?: FilterState;
  limit?: number;
  offset?: number;
}

export interface SearchUpgradesResponse {
  packages: Package[];
  count: number;
  prev: string | null;
  next: string | null;
}

export default function useSearchUpgrades(
  params: SearchUpgradesRequest,
  options: Omit<
    UseQueryOptions<
      AxiosResponse<SearchUpgradesResponse>,
      AxiosError<ApiError>
    >,
    "queryKey" | "queryFn"
  > = {},
) {
  const authFetch = useFetch();

  return useQuery<AxiosResponse<SearchUpgradesResponse>, AxiosError<ApiError>>({
    queryKey: ["packageUpgrades", params],
    queryFn: async () => authFetch.post("packages:search-upgrades", params),
    ...options,
  });
}
