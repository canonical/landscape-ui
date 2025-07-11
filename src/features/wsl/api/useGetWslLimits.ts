import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

export const useGetWslLimits = () => {
  const authFetch = useFetch();

  const { data: response, isPending } = useQuery<
    AxiosResponse<{
      max_windows_host_machines: number;
      max_wsl_child_instances_per_host: number;
      max_wsl_child_instance_profiles: number;
    }>,
    AxiosError<ApiError>
  >({
    queryKey: ["wslLimits"],
    queryFn: async () => authFetch.get("wsl-feature-limits"),
  });

  return {
    isGettingWslLimits: isPending,
    windowsInstanceLimit: response?.data.max_windows_host_machines ?? 0,
    windowsInstanceChildLimit:
      response?.data.max_wsl_child_instances_per_host ?? 0,
    wslProfileLimit: response?.data.max_wsl_child_instance_profiles ?? 0,
  };
};
