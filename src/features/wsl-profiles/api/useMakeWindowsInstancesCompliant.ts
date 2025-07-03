import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

interface MakeWindowsInstancesCompliantParams {
  host_computer_ids: number[];
}

export const useMakeWindowsInstancesCompliant = () => {
  const authFetch = useFetch();

  const { isPending, mutateAsync } = useMutation<
    AxiosResponse<void>,
    AxiosError<ApiError>,
    MakeWindowsInstancesCompliantParams
  >({
    mutationFn: async (params) =>
      authFetch.post("child-instance-profiles/make-hosts-compliant", params),
  });

  return {
    isMakingWindowsInstancesCompliant: isPending,
    makeWindowsInstancesCompliant: mutateAsync,
  };
};
