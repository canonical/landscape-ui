import { AxiosError, AxiosResponse } from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import CATEGORIES from "@/data/esm-repos.json";
import { ApiError } from "@/types/ApiError";
import { Series } from "@/types/Series";
import { QueryFnType } from "@/types/QueryFnType";
import { UbuntuProCategory } from "@/types/UbuntuProCategory";
import useDebug from "./useDebug";
import useFetchOld from "./useFetchOld";

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
      queryKey: ["repoInfo", queryParams],
      queryFn: () =>
        authFetch!.get("GetRepoInfo", {
          params: queryParams,
        }),
      ...config,
    });

  const getUbuntuProCategoriesQuery = (queryParams = {}, config = {}) =>
    useQuery<UbuntuProCategory[]>({
      queryKey: ["ubuntuProCategories", queryParams],
      queryFn: () =>
        CATEGORIES.map((category) => ({
          ...category,
          pockets: category.pockets.map((pocket) =>
            pocket.replace(/^([a-z]+-)*/, ""),
          ),
        })),
      ...config,
    });

  return {
    createSeriesQuery,
    removeSeriesQuery,
    deriveSeriesQuery,
    getRepoInfo,
    getUbuntuProCategoriesQuery,
  };
}
