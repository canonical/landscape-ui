import type { UseQueryOptions } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { PackageChangePlanSummaryItem } from "../types/PackageChangePlanSummaryItem";
import type { ApiError } from "@/types/api/ApiError";
import useFetch from "@/hooks/useFetch";

export interface GetPackageChangePlanSummaryResponse {
  summary_items: PackageChangePlanSummaryItem[];
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
