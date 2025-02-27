import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/ApiError";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { AutoinstallFile } from "../types";

interface GetAutoinstallFileParams {
  version?: number;
}

export default function useAutoinstallFile(
  id: number,
  params: GetAutoinstallFileParams,
): AutoinstallFile | undefined {
  const authFetch = useFetch();

  const { data: response } = useQuery<
    AxiosResponse<AutoinstallFile>,
    AxiosError<ApiError>
  >({
    queryKey: ["autoinstallFile", { id, ...params }],
    queryFn: () =>
      authFetch.get(`autoinstall/${id}`, {
        params,
      }),
  });

  return response?.data;
}
