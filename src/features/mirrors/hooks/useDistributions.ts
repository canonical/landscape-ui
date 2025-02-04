import useFetchOld from "@/hooks/useFetchOld";
import type { ApiError } from "@/types/ApiError";
import type { QueryFnType } from "@/types/QueryFnType";
import type { UseMutationResult } from "@tanstack/react-query";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type {
  CreateDistributionParams,
  Distribution,
  GetDistributionsParams,
  RemoveDistributionParams,
} from "../types";

export default function useDistributions(): {
  createDistributionQuery: UseMutationResult<
    AxiosResponse<Distribution>,
    AxiosError<ApiError>,
    RemoveDistributionParams
  >;
  getDistributionsQuery: QueryFnType<
    AxiosResponse<Distribution[]>,
    GetDistributionsParams
  >;
  removeDistributionQuery: UseMutationResult<
    AxiosResponse<void>,
    AxiosError<ApiError>,
    RemoveDistributionParams
  >;
} {
  const queryClient = useQueryClient();
  const authFetch = useFetchOld();

  const getDistributionsQuery: QueryFnType<
    AxiosResponse<Distribution[]>,
    GetDistributionsParams
  > = (queryParams = {}, config = {}) =>
    useQuery<AxiosResponse<Distribution[]>, AxiosError<ApiError>>({
      queryKey: ["distributions"],
      queryFn: () =>
        authFetch.get("GetDistributions", {
          params: queryParams,
        }),
      ...config,
    });

  const createDistributionQuery = useMutation<
    AxiosResponse<Distribution>,
    AxiosError<ApiError>,
    CreateDistributionParams
  >({
    mutationKey: ["distributions", "new"],
    mutationFn: (params) => authFetch.get("CreateDistribution", { params }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["distributions"] }),
  });

  const removeDistributionQuery = useMutation<
    AxiosResponse<void>,
    AxiosError<ApiError>,
    RemoveDistributionParams
  >({
    mutationKey: ["distributions", "remove"],
    mutationFn: (params) => authFetch.get("RemoveDistribution", { params }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["distributions"] }),
  });

  return {
    getDistributionsQuery,
    createDistributionQuery,
    removeDistributionQuery,
  };
}
