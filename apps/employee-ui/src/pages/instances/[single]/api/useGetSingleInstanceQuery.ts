/* eslint-disable @typescript-eslint/no-unused-vars */
import { useFetch } from "@landscape/context";
import type { ApiError, Instance } from "@landscape/types";
import type { UseQueryOptions } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import { instances } from "../../InstancesPage/mocks";

interface GetSingleInstanceParams {
  instanceId: number;
  with_annotations?: boolean;
  with_grouped_hardware?: boolean;
  with_hardware?: boolean;
  with_network?: boolean;
}

const useGetSingleInstanceQuery = (
  params: GetSingleInstanceParams,
  config: Omit<
    UseQueryOptions<AxiosResponse<Instance>, AxiosError<ApiError>>,
    "queryKey" | "queryFn"
  > = {},
) => {
  const authFetch = useFetch();

  // const { data, isPending } = useQuery<
  //   AxiosResponse<Instance>,
  //   AxiosError<ApiError>
  // >({
  //   queryKey: ["instances", params.instanceId, params],
  //   queryFn: async () =>
  //     authFetch.get(`computers/${params.instanceId}`, { params }),
  //   ...config,
  // });

  return {
    // instance: data?.data ?? null,
    // isInstanceLoading: isPending,
    instance: instances[0],
    isInstanceLoading: false,
  };
};

export default useGetSingleInstanceQuery;
