import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import useFetchOld from "@/hooks/useFetchOld";
import { QueryFnType } from "@/types/QueryFnType";
import { AxiosError, AxiosResponse } from "axios";
import { ApiError } from "@/types/ApiError";

interface CommonGetParams {
  query?: string;
}

interface GetNotPingingInstancesParams extends CommonGetParams {
  since_minutes: number;
}

interface GetUsnTimeToFixParams extends CommonGetParams {
  fixed_in_days?: number[];
  in_last?: number;
  pending_in_days?: number;
}

export default function useReports() {
  const authFetchOld = useFetchOld();

  const getCsvComplianceData: QueryFnType<
    AxiosResponse<string>,
    CommonGetParams
  > = (queryParams = {}, config = {}) =>
    useQuery<AxiosResponse<string>, AxiosError<ApiError>>({
      queryKey: ["csvComplianceData", queryParams],
      queryFn: () =>
        authFetchOld.get("GetCSVComplianceData", {
          params: queryParams,
        }),
      ...config,
    });

  const getInstancesNotUpgraded: QueryFnType<
    AxiosResponse<number[]>,
    CommonGetParams
  > = (queryParams = {}, config = {}) =>
    useQuery<AxiosResponse<number[]>, AxiosError<ApiError>>({
      queryKey: ["instancesNotUpgraded", queryParams],
      queryFn: () =>
        authFetchOld.get("GetComputersNotUpgraded", {
          params: queryParams,
        }),
      ...config,
    });

  const getNotPingingInstances = (
    queryParams: GetNotPingingInstancesParams,
    config: Omit<
      UseQueryOptions<AxiosResponse<number[]>, AxiosError<ApiError>>,
      "queryKey" | "queryFn"
    > = {},
  ) =>
    useQuery<AxiosResponse<number[]>, AxiosError<ApiError>>({
      queryKey: ["notPingingInstances", queryParams],
      queryFn: () =>
        authFetchOld.get("GetNotPingingComputers", {
          params: queryParams,
        }),
      ...config,
    });

  const getUsnTimeToFix: QueryFnType<
    AxiosResponse<Record<`${number}` | "pending", number[]>>,
    GetUsnTimeToFixParams
  > = (queryParams = {}, config = {}) =>
    useQuery<
      AxiosResponse<Record<string | "pending", number[]>>,
      AxiosError<ApiError>
    >({
      queryKey: ["usnTimeToFix", queryParams],
      queryFn: () =>
        authFetchOld.get("GetUSNTimeToFix", {
          params: queryParams,
        }),
      ...config,
    });

  const getUpgradedInstancesByFrequency: QueryFnType<
    AxiosResponse<{ "Every hour at 30 minutes past the hour": number[] }>,
    CommonGetParams
  > = (queryParams = {}, config = {}) =>
    useQuery<
      AxiosResponse<{ "Every hour at 30 minutes past the hour": number[] }>,
      AxiosError<ApiError>
    >({
      queryKey: ["upgradedInstancesByFrequency", queryParams],
      queryFn: () =>
        authFetchOld.get("GetUpgradedComputersByFrequency", {
          params: queryParams,
        }),
      ...config,
    });

  return {
    getCsvComplianceData,
    getInstancesNotUpgraded,
    getNotPingingInstances,
    getUsnTimeToFix,
    getUpgradedInstancesByFrequency,
  };
}
