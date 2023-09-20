import useFetch from "./useFetch";
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
  name: string;
  distribution: string;
  pockets?: string[];
  components?: string[];
  architectures?: string[];
  gpg_key?: string;
  mirror_gpg_key?: string;
  mirror_uri?: string;
  mirror_series?: string;
  include_udeb: boolean;
}

export interface DeriveSeriesParams {
  name: string;
  origin: string;
  distribution: string;
}

export interface RemoveSeriesParams {
  name: string;
  distribution: string;
}

interface Repo {
  architectures: string;
  codename: string;
  description: string;
  label: string;
  origin: string;
  repo: string;
  url: string;
  version: string;
}

interface RepoInfo {
  flat: boolean;
  repos: Repo[];
  ubuntu: boolean;
}

interface GetRepoInfoParams {
  mirror_uri: string;
}

interface UseSeriesResult {
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
  const authFetch = useFetch();
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
