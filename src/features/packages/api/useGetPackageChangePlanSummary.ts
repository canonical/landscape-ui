import type { UseQueryOptions } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { ApiError } from "@/types/api/ApiError";
import useFetch from "@/hooks/useFetch";
import type { PackageChangePlanItem } from "../types";

export interface GetPackageChangePlanSummaryResponse {
  actions: {
    action: PackageChangePlanItem;
    computer_count: number;
  }[];
  exclusions: {
    package_name: string;
    computer_count: number;
  }[];
}

export default function useGetPackageChangePlanSummary(
  id: number,
  options: Omit<
    UseQueryOptions<
      AxiosResponse<GetPackageChangePlanSummaryResponse>,
      AxiosError<ApiError>
    >,
    "queryKey" | "queryFn"
  > = {},
) {
  const authFetch = useFetch();

  return useQuery<
    AxiosResponse<GetPackageChangePlanSummaryResponse>,
    AxiosError<ApiError>
  >({
    queryKey: ["packageChangePlans", id, "summary"],
    queryFn: async () => authFetch.get(`package-change-plans/${id}/summary`),
    ...options,
  });
}
