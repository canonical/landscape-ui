import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import type { UseQueryOptions } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { AvailableSnapInfo } from "../types";

interface GetSnapInfoParams {
  instance_id: number;
  name: string;
}

export const useGetSnapInfo = (
  params: GetSnapInfoParams,
  options: Omit<
    UseQueryOptions<AxiosResponse<AvailableSnapInfo>, AxiosError<ApiError>>,
    "queryKey" | "queryFn"
  > = {},
) => {
  const authFetch = useFetch();

  const { data, isLoading } = useQuery<
    AxiosResponse<AvailableSnapInfo>,
    AxiosError<ApiError>
  >({
    queryKey: ["snaps", "info", { ...params }],
    queryFn: async () =>
      authFetch.get(
        `computers/${params.instance_id}/snaps/${encodeURIComponent(params.name)}/info`,
      ),
    ...options,
  });

  return {
    snapInfo: data?.data ?? null,
    isSnapInfoLoading: isLoading,
  };
};
