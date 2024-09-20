import useFetchOld from "./useFetchOld";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Series } from "@/types/Series";
import { AxiosError, AxiosResponse } from "axios";
import { ApiError } from "@/types/ApiError";
import { QueryFnType } from "@/types/QueryFnType";

export interface CreateSeriesParams {
  distribution: string;
  include_udeb: boolean;
  name: string;
  architectures?: string[];
  components?: string[];
  gpg_key?: string;
  mirror_gpg_key?: string;
  mirror_series?: string;
  mirror_uri?: string;
  pockets?: string[];
}

export interface DeriveSeriesParams {
  distribution: string;
  name: string;
  origin: string;
}

export interface RemoveSeriesParams {
  distribution: string;
  name: string;
}

export interface Repo {
  architectures: string;
  codename: string;
  description: string;
  label: string;
  origin: string;
  repo: string;
  url: string;
  version: string;
}

export interface RepoInfo {
  flat: boolean;
  repos: Repo[];
  ubuntu: boolean;
}

export interface GetRepoInfoParams {
  mirror_uri: string;
}

export default function useSeries() {
  const queryClient = useQueryClient();
  const authFetch = useFetchOld();

  const createSeriesQuery = useMutation<
    AxiosResponse<Series>,
    AxiosError<ApiError>,
    CreateSeriesParams
  >({
    mutationKey: ["series", "new"],
    mutationFn: (params) => authFetch!.get("CreateSeries", { params }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["distributions"] }),
  });

  const deriveSeriesQuery = useMutation<
    AxiosResponse<Series>,
    AxiosError<ApiError>,
    DeriveSeriesParams
  >({
    mutationKey: ["series", "derive"],
    mutationFn: (params) => authFetch!.get("DeriveSeries", { params }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["distributions"] }),
  });

  const removeSeriesQuery = useMutation<
    AxiosResponse<void>,
    AxiosError<ApiError>,
    RemoveSeriesParams
  >({
    mutationKey: ["series", "remove"],
    mutationFn: (params) => authFetch!.get("RemoveSeries", { params }),
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
        authFetch!.get("GetRepoInfo", {
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
