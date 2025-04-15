import type { ApiError } from "@/types/api/ApiError";
import type { QueryFnType } from "@/types/QueryFnType";
import type { UseMutationResult } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { RepoInfo, Series } from "./Series";
import type {
  CreateSeriesParams,
  DeriveSeriesParams,
  GetRepoInfoParams,
  RemoveSeriesParams,
} from "./SeriesParams";

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
  getRepoInfo: QueryFnType<AxiosResponse<RepoInfo>, GetRepoInfoParams>;
  removeSeriesQuery: UseMutationResult<
    AxiosResponse<void>,
    AxiosError<ApiError>,
    RemoveSeriesParams
  >;
}
