import useFetch from "@/hooks/useFetch";
import type { ApiError } from "@/types/api/ApiError";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { APTSource } from "../types";

interface GetAPTSourcesParams {
  ids?: number[];
  names?: string[];
}

interface GetAPTSourcesResult {
  results: APTSource[];
}

export const useGetAPTSources = (params?: GetAPTSourcesParams) => {
  const authFetch = useFetch();

  const { data: response, isPending } = useQuery<
    AxiosResponse<GetAPTSourcesResult>,
    AxiosError<ApiError>
  >({
    queryKey: ["aptSources", params],
    queryFn: () => authFetch.get("repository/apt-source", { params }),
  });

  return {
    aptSources: response?.data.results ?? [],
    isGettingAPTSources: isPending,
  };
};
