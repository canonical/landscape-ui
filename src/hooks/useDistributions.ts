import useFetch from "./useFetch";
import {
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Distribution } from "../types/Distribution";
import useDebug from "./useDebug";
import { AxiosError, AxiosResponse } from "axios";
import { QueryFnType } from "../types/QueryFnType";
import { ApiError } from "../types/ApiError";

interface GetDistributionsParams {
  names?: string[];
}

interface CreateDistributionParams {
  name: string;
  access_group?: string;
}

interface RemoveDistributionParams {
  name: string;
}

interface UseDistributionsResult {
  getDistributionsQuery: QueryFnType<
    AxiosResponse<Distribution[]>,
    GetDistributionsParams
  >;
  createDistributionQuery: UseMutationResult<
    AxiosResponse<Distribution>,
    AxiosError<ApiError>,
    CreateDistributionParams
  >;
  removeDistributionQuery: UseMutationResult<
    AxiosResponse<void>,
    AxiosError<ApiError>,
    RemoveDistributionParams
  >;
}

export default function useDistributions(): UseDistributionsResult {
  const queryClient = useQueryClient();
  const authFetch = useFetch();
  const debug = useDebug();

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
    onSuccess: () => {
      queryClient.fetchQuery(["distributions"]).then(debug);
    },
  });

  const removeDistributionQuery = useMutation<
    AxiosResponse<void>,
    AxiosError<ApiError>,
    RemoveDistributionParams
  >({
    mutationKey: ["distributions", "remove"],
    mutationFn: (params) => authFetch!.get("RemoveDistribution", { params }),
    onSuccess: () => {
      queryClient.fetchQuery(["distributions"]).then(debug);
    },
  });

  return {
    getDistributionsQuery,
    createDistributionQuery,
    removeDistributionQuery,
  };
}
