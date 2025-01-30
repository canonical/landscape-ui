import useFetchOld from "@/hooks/useFetchOld";
import type { ApiError } from "@/types/ApiError";
import type { QueryFnType } from "@/types/QueryFnType";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type {
  CreateSeriesParams,
  DeriveSeriesParams,
  GetRepoInfoParams,
  RemoveSeriesParams,
  RepoInfo,
  Series,
} from "../types";

export default function useSeries() {
  const queryClient = useQueryClient();
  const authFetch = useFetchOld();

  const createSeriesQuery = useMutation<
    AxiosResponse<Series>,
    AxiosError<ApiError>,
    CreateSeriesParams
  >({
    mutationKey: ["series", "new"],
    mutationFn: (params) => authFetch.get("CreateSeries", { params }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["distributions"] }),
  });

  const deriveSeriesQuery = useMutation<
    AxiosResponse<Series>,
    AxiosError<ApiError>,
    DeriveSeriesParams
  >({
    mutationKey: ["series", "derive"],
    mutationFn: (params) => authFetch.get("DeriveSeries", { params }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["distributions"] }),
  });

  const removeSeriesQuery = useMutation<
    AxiosResponse<void>,
    AxiosError<ApiError>,
    RemoveSeriesParams
  >({
    mutationKey: ["series", "remove"],
    mutationFn: (params) => authFetch.get("RemoveSeries", { params }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["distributions"] }),
  });

  const getRepoInfo: QueryFnType<AxiosResponse<RepoInfo>, GetRepoInfoParams> = (
    queryParams,
    config = {},
  ) =>
    useQuery<AxiosResponse<RepoInfo>, AxiosError<ApiError>>({
      queryKey: ["repoInfo", { queryParams }],
      queryFn: () =>
        authFetch.get("GetRepoInfo", {
          params: queryParams,
        }),
      ...config,
    });

  return {
    createSeriesQuery,
    removeSeriesQuery,
    deriveSeriesQuery,
    getRepoInfo,
  };
}
