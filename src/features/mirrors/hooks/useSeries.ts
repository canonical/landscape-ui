import useFetchOld from "@/hooks/useFetchOld";
import type { ApiError } from "@/types/ApiError";
import type { QueryFnType } from "@/types/QueryFnType";
import type { UseMutationResult } from "@tanstack/react-query";
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

export default function useSeries(): {
  createSeriesQuery: UseMutationResult<
    AxiosResponse<Series>,
    AxiosError<ApiError>,
    CreateSeriesParams
  >;
  deriveSeriesQuery: UseMutationResult<
    AxiosResponse<Series>,
    AxiosError<ApiError>,
    DeriveSeriesParams
  >;
  getRepoInfo: QueryFnType<AxiosResponse<RepoInfo>, GetRepoInfoParams>;
  removeSeriesQuery: UseMutationResult<
    AxiosResponse<void>,
    AxiosError<ApiError>,
    RemoveSeriesParams
  >;
} {
  const queryClient = useQueryClient();
  const authFetch = useFetchOld();

  const createSeriesQuery = useMutation<
    AxiosResponse<Series>,
    AxiosError<ApiError>,
    CreateSeriesParams
  >({
    mutationKey: ["series", "new"],
    mutationFn: async (params) => authFetch.get("CreateSeries", { params }),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["distributions"] }),
  });

  const deriveSeriesQuery = useMutation<
    AxiosResponse<Series>,
    AxiosError<ApiError>,
    DeriveSeriesParams
  >({
    mutationKey: ["series", "derive"],
    mutationFn: async (params) => authFetch.get("DeriveSeries", { params }),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["distributions"] }),
  });

  const removeSeriesQuery = useMutation<
    AxiosResponse<void>,
    AxiosError<ApiError>,
    RemoveSeriesParams
  >({
    mutationKey: ["series", "remove"],
    mutationFn: async (params) => authFetch.get("RemoveSeries", { params }),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["distributions"] }),
  });

  const getRepoInfo: QueryFnType<AxiosResponse<RepoInfo>, GetRepoInfoParams> = (
    queryParams,
    config = {},
  ) =>
    useQuery<AxiosResponse<RepoInfo>, AxiosError<ApiError>>({
      queryKey: ["repoInfo", { queryParams }],
      queryFn: async () =>
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
