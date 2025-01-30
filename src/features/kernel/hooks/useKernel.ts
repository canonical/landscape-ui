import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/ApiError";
import type { UseQueryOptions } from "@tanstack/react-query";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { KernelManagementInfo } from "../types/Kernel";
import type { Activity } from "@/features/activities";
import type { LivepatchInformation } from "../types";

export interface GetKernelInformationParams {
  id: number;
}

interface GetLivepatchInfoParams {
  id: number;
  sort_by?: string;
}

interface KernelActionParams {
  id: number;
  kernel_package_id: number;
  reboot_after: boolean;
}

export default function useKernel() {
  const authFetch = useFetch();
  const queryClient = useQueryClient();

  const getKernelQuery = (
    { id }: GetKernelInformationParams,
    config: Omit<
      UseQueryOptions<
        AxiosResponse<KernelManagementInfo>,
        AxiosError<ApiError>
      >,
      "queryKey" | "queryFn"
    > = {},
  ) => {
    return useQuery<AxiosResponse<KernelManagementInfo>, AxiosError<ApiError>>({
      queryKey: ["kernel", id],
      queryFn: () => authFetch.get(`computers/${id}/livepatch/kernel`),
      ...config,
    });
  };

  const getLivepatchInfoQuery = (
    { id, ...queryParams }: GetLivepatchInfoParams,
    config: Omit<
      UseQueryOptions<
        AxiosResponse<LivepatchInformation>,
        AxiosError<ApiError>
      >,
      "queryKey" | "queryFn"
    > = {},
  ) => {
    return useQuery<AxiosResponse<LivepatchInformation>, AxiosError<ApiError>>({
      queryKey: ["kernel", { id, ...queryParams }],
      queryFn: () =>
        authFetch.get(`computers/${id}/livepatch/info`, {
          params: queryParams,
        }),
      ...config,
    });
  };

  const downgradeKernelQuery = useMutation<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    KernelActionParams
  >({
    mutationKey: ["kernel", "downgrade"],
    mutationFn: ({ id, ...queryParams }) =>
      authFetch.post(`computers/${id}/kernel/downgrade`, queryParams),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["kernel"] }),
  });

  const upgradeKernelQuery = useMutation<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    KernelActionParams
  >({
    mutationKey: ["kernel", "upgrade"],
    mutationFn: ({ id, ...queryParams }) =>
      authFetch.post(`computers/${id}/kernel/upgrade`, queryParams),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["kernel"] }),
  });

  return {
    getKernelQuery,
    getLivepatchInfoQuery,
    downgradeKernelQuery,
    upgradeKernelQuery,
  };
}
