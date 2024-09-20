import useFetchOld from "./useFetchOld";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Distribution } from "@/types/Distribution";
import { AxiosError, AxiosResponse } from "axios";
import { QueryFnType } from "@/types/QueryFnType";
import { ApiError } from "@/types/ApiError";

interface GetDistributionsParams {
  names?: string[];
  include_latest_sync?: boolean;
}

interface CreateDistributionParams {
  name: string;
  access_group?: string;
}

interface RemoveDistributionParams {
  name: string;
}

export default function useDistributions() {
  const queryClient = useQueryClient();
  const authFetch = useFetchOld();

  const getDistributionsQuery: QueryFnType<
    AxiosResponse<Distribution[]>,
    GetDistributionsParams
  > = (queryParams = {}, config = {}) =>
    useQuery<AxiosResponse<Distribution[]>, AxiosError<ApiError>>({
      queryKey: ["distributions"],
      queryFn: () =>
        authFetch!.get("GetDistributions", {
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
    mutationFn: (params) => authFetch!.get("CreateDistribution", { params }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["distributions"] }),
  });

  const removeDistributionQuery = useMutation<
    AxiosResponse<void>,
    AxiosError<ApiError>,
    RemoveDistributionParams
  >({
    mutationKey: ["distributions", "remove"],
    mutationFn: (params) => authFetch!.get("RemoveDistribution", { params }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["distributions"] }),
  });

  return {
    getDistributionsQuery,
    createDistributionQuery,
    removeDistributionQuery,
  };
}
