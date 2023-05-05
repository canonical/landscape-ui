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

interface UseDistributionsResult {
  getDistributionsQuery: QueryFnType<Distribution[], GetDistributionsParams>;
  createDistributionQuery: UseMutationResult<
    AxiosResponse<Distribution>,
    AxiosError<ApiError>,
    CreateDistributionParams
  >;
}

export default function useDistributions(): UseDistributionsResult {
  const queryClient = useQueryClient();
  const authFetch = useFetch();
  const debug = useDebug();

  const getDistributionsQuery: QueryFnType<
    Distribution[],
    GetDistributionsParams
  > = (queryParams = {}, config = {}) =>
    // @ts-ignore
    useQuery<AxiosResponse<Distribution[]>, AxiosError<ApiError>>({
      // @ts-ignore
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

  return { getDistributionsQuery, createDistributionQuery };
}
