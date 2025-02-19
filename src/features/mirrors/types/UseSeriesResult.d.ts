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
