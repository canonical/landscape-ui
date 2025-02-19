export interface UsePocketsResult {
  addPackageFiltersToPocketQuery: UseMutationResult<
    AxiosResponse<Pocket>,
    AxiosError<ApiError>,
    AddPackageFiltersToPocketParams
  >;
  addUploaderGPGKeysToPocketQuery: UseMutationResult<
    AxiosResponse<Pocket>,
    AxiosError<ApiError>,
    AddUploaderGPGKeysToPocketParams
  >;
  createPocketQuery: UseMutationResult<
    AxiosResponse<Pocket>,
    AxiosError<ApiError>,
    CreateMirrorPocketParams | CreatePullPocketParams | CreateUploadPocketParams
  >;
  diffPullPocketQuery: QueryFnType<
    AxiosResponse<PackageDiff>,
    DiffPullPocketParams
  >;
  editPocketQuery: UseMutationResult<
    AxiosResponse<Pocket>,
    AxiosError<ApiError>,
    EditMirrorPocketParams | EditPullPocketParams | EditUploadPocketParams
  >;
  listPocketQuery: QueryFnType<
    AxiosResponse<ApiPaginatedResponse<PackageObject>>,
    ListPocketParams
  >;
  pullPackagesToPocketQuery: UseMutationResult<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    PullPackagesToPocketParams
  >;
  removePackageFiltersFromPocketQuery: UseMutationResult<
    AxiosResponse<Pocket>,
    AxiosError<ApiError>,
    RemovePackageFiltersFromPocketParams
  >;
  removePackagesFromPocketQuery: UseMutationResult<
    AxiosResponse<void>,
    AxiosError<ApiError>,
    RemovePackagesFromPocketParams
  >;
  removePocketQuery: UseMutationResult<
    AxiosResponse<void>,
    AxiosError<ApiError>,
    RemovePocketParams
  >;
  removeUploaderGPGKeysFromPocketQuery: UseMutationResult<
    AxiosResponse<Pocket>,
    AxiosError<ApiError>,
    RemoveUploaderGPGKeysFromPocketParams
  >;
  syncMirrorPocketQuery: UseMutationResult<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    SyncMirrorPocketParams
  >;
}
