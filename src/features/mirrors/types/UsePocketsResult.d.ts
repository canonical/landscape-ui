import type { Activity } from "@/features/activities";
import type { PackageDiff, PackageObject } from "@/features/packages";
import type { ApiError } from "@/types/ApiError";
import type { ApiPaginatedResponse } from "@/types/ApiPaginatedResponse";
import type { QueryFnType } from "@/types/QueryFnType";
import type { UseMutationResult } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import type { Pocket } from "./Pocket";
import type {
  AddPackageFiltersToPocketParams,
  AddUploaderGPGKeysToPocketParams,
  CreateMirrorPocketParams,
  CreatePullPocketParams,
  CreateUploadPocketParams,
  DiffPullPocketParams,
  EditMirrorPocketParams,
  EditPullPocketParams,
  EditUploadPocketParams,
  ListPocketParams,
  PullPackagesToPocketParams,
  RemovePackageFiltersFromPocketParams,
  RemovePackagesFromPocketParams,
  RemovePocketParams,
} from "./PocketParams";
import type {
  RemoveUploaderGPGKeysFromPocketParams,
  SyncMirrorPocketParams,
} from "./PocketParams";

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
