import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import type { UseQueryOptions } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { ComplianceReport } from "../types";

export interface GetComplianceReportParams {
  query?: string;
}

export const useGetComplianceReport = (
  params: GetComplianceReportParams,
  options?: Omit<
    UseQueryOptions<AxiosResponse<ComplianceReport>, AxiosError<ApiError>>,
    "queryKey" | "queryFn"
  >,
) => {
  const authFetch = useFetch();

  const resolvedParams = {
    ...params,
    query: params.query || undefined,
  };

  const {
    data: response,
    isLoading,
    isError,
  } = useQuery<AxiosResponse<ComplianceReport>, AxiosError<ApiError>>({
    queryKey: ["complianceReport", resolvedParams],
    queryFn: async () =>
      authFetch.get("computers/compliance-report", { params: resolvedParams }),
    ...options,
  });

  return {
    report: response?.data,
    isGettingComplianceReport: isLoading,
    isComplianceReportError: isError,
  };
};
