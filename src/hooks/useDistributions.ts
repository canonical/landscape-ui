import useFetch from "./useFetch";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Distribution } from "../schemas/Distribution";
import useDebug from "./useDebug";
import { AxiosError } from "axios";
import { QueryFnType } from "../types/QueryFnType";
import { MutationFnType } from "../types/MutationFnType";
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
  createDistributionQuery: MutationFnType<
    Distribution,
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
    useQuery<Distribution[], AxiosError<ApiError>>({
      // @ts-ignore
      queryKey: ["distributions"],
      queryFn: () =>
        authFetch!
          .get("GetDistributions", {
            params: queryParams,
          })
          .then(({ data }) => data ?? [])
          .catch(debug),
      ...config,
    });

  const createDistributionQuery: MutationFnType<
    Distribution,
    CreateDistributionParams
  > = (body, config = {}) =>
    // @ts-ignore
    useMutation<Distribution[], AxiosError<ApiError>>({
      mutationKey: ["distributions", body.name],
      mutationFn: () =>
        authFetch!
          .post("CreateDistribution", body)
          .then(({ data }) => data)
          .catch(debug),
      onSuccess: () => {
        queryClient.fetchQuery(["distributions"]).then(debug);
      },
      ...config,
    });

  return { getDistributionsQuery, createDistributionQuery };
}
