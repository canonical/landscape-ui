import type { KernelManagementInfo } from "@/features/kernel";
import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import { getStaffAccountPath } from "./helpers";

/** Gets the kernel information of an instance of the account named `name`. */
export const useGetStaffKernel = (name: string, instanceId: number) => {
  const authFetch = useFetch();

  const {
    data: response,
    isPending,
    error,
  } = useQuery<AxiosResponse<KernelManagementInfo>, AxiosError<ApiError>>({
    queryKey: ["staffKernel", name, instanceId],
    queryFn: async () =>
      authFetch.get(
        getStaffAccountPath(name, `computers/${instanceId}/livepatch/kernel`),
      ),
    enabled: !!name && Number.isInteger(instanceId),
  });

  return {
    staffKernel: response?.data,
    isGettingStaffKernel: isPending,
    staffKernelError: error,
  };
};
