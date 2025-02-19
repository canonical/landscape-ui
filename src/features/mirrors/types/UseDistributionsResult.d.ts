export interface UseDistributionsResult {
  createDistributionQuery: UseMutationResult<
    AxiosResponse<Distribution>,
    AxiosError<ApiError>,
    RemoveDistributionParams
  >;
  getDistributionsQuery: QueryFnType<
    AxiosResponse<Distribution[]>,
    GetDistributionsParams
  >;
  removeDistributionQuery: UseMutationResult<
    AxiosResponse<void>,
    AxiosError<ApiError>,
    RemoveDistributionParams
  >;
}
