import useFetchOld from "./useFetchOld";
import {
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Series } from "../types/Series";
import useDebug from "./useDebug";
import { AxiosError, AxiosResponse } from "axios";
import { ApiError } from "../types/ApiError";
import { QueryFnType } from "../types/QueryFnType";

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

export interface UseSeriesResult {
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
  removeSeriesQuery: UseMutationResult<
    AxiosResponse<void>,
    AxiosError<ApiError>,
    RemoveSeriesParams
  >;
  getRepoInfo: QueryFnType<AxiosResponse<RepoInfo>, GetRepoInfoParams>;
}

export default function useSeries(): UseSeriesResult {
  const queryClient = useQueryClient();
  const authFetch = useFetchOld();
  const debug = useDebug();

  const createSeriesQuery = useMutation<
    AxiosResponse<Series>,
    AxiosError<ApiError>,
    CreateSeriesParams
  >({
    mutationKey: ["series", "new"],
    mutationFn: (params) => authFetch!.get("CreateSeries", { params }),
    onSuccess: () => {
      queryClient.invalidateQueries(["distributions"]).catch(debug);
    },
  });

  const deriveSeriesQuery = useMutation<
    AxiosResponse<Series>,
    AxiosError<ApiError>,
    DeriveSeriesParams
  >({
    mutationKey: ["series", "derive"],
    mutationFn: (params) => authFetch!.get("DeriveSeries", { params }),
    onSuccess: () => {
      queryClient.invalidateQueries(["distributions"]).catch(debug);
    },
  });

  const removeSeriesQuery = useMutation<
    AxiosResponse<void>,
    AxiosError<ApiError>,
    RemoveSeriesParams
  >({
    mutationKey: ["series", "remove"],
    mutationFn: (params) => authFetch!.get("RemoveSeries", { params }),
    onSuccess: () => {
      queryClient.invalidateQueries(["distributions"]).catch(debug);
    },
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
