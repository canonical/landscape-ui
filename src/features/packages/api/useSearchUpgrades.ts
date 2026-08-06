import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import type { UseQueryOptions } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { Package } from "../types";
import type { FilterState } from "../types/FilterState";

export interface SearchPackagesVulnerabilitiesRequest {
  computer_query: string;
  text?: string;
  names?: string[];
  security?: FilterState;
  limit?: number;
  offset?: number;
}

export interface SearchPackagesVulnerabilitiesResponse {
  packages: Package[];
  count: number;
  prev: string;
  next: string;
}

export default function useSearchPackageVulnerabilities(
  params: SearchPackagesVulnerabilitiesRequest,
  options: Omit<
    UseQueryOptions<
      AxiosResponse<SearchPackagesVulnerabilitiesResponse>,
      AxiosError<ApiError>,
      SearchPackagesVulnerabilitiesRequest
    >,
    "queryKey" | "queryFn"
  > = {},
) {
  const authFetch = useFetch();

  return useQuery<
    AxiosResponse<SearchPackagesVulnerabilitiesResponse>,
    AxiosError<ApiError>,
    SearchPackagesVulnerabilitiesRequest
  >({
    queryKey: ["packageVulnerabilities", params],
    queryFn: async () => authFetch.post("packages:search-upgrades", params),
    ...options,
  });
}
