import { AxiosError, AxiosResponse } from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Activity } from "@/features/activities";
import { PackageDiff, PackageObject } from "@/features/packages";
import { ApiError } from "@/types/ApiError";
import { ApiPaginatedResponse } from "@/types/ApiPaginatedResponse";
import { Pocket } from "@/types/Pocket";
import { QueryFnType } from "@/types/QueryFnType";
import useFetchOld from "./useFetchOld";

export interface CreateCommonPocketParams {
  architectures: string[];
  components: string[];
  distribution: string;
  gpg_key: string;
  include_udeb: boolean;
  name: string;
  series: string;
}

export interface CreateMirrorPocketParams extends CreateCommonPocketParams {
  mirror_uri: string;
  mode: "mirror";
  mirror_gpg_key?: string;
  mirror_suite?: string;
}

export interface CreatePullPocketParams extends CreateCommonPocketParams {
  mode: "pull";
  pull_pocket: string;
  filter_packages?: string[];
  filter_type?: "whitelist" | "blacklist";
  pull_series?: string;
}

export interface CreateUploadPocketParams extends CreateCommonPocketParams {
  mode: "upload";
  upload_allow_unsigned: boolean;
}

export interface EditCommonPocketParams {
  architectures: string[];
  components: string[];
  distribution: string;
  gpg_key: string;
  name: string;
  series: string;
  include_udeb?: boolean;
}

export interface EditMirrorPocketParams extends EditCommonPocketParams {
  mirror_uri: string;
  mirror_gpg_key?: string;
  mirror_suite?: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface EditPullPocketParams extends EditCommonPocketParams {}

export interface EditUploadPocketParams extends EditCommonPocketParams {
  upload_allow_unsigned: boolean;
}

export interface RemovePocketParams {
  distribution: string;
  name: string;
  series: string;
}

export interface SyncMirrorPocketParams {
  distribution: string;
  name: string;
  series: string;
}

export interface PullPackagesToPocketParams {
  distribution: string;
  name: string;
  series: string;
}

export interface DiffPullPocketParams {
  distribution: string;
  name: string;
  series: string;
}

export interface ListPocketParams {
  distribution: string;
  limit: number;
  name: string;
  offset: number;
  series: string;
  search?: string;
}

export interface RemovePackagesFromPocketParams {
  distribution: string;
  name: string;
  packages: string[];
  series: string;
}

export interface AddPackageFiltersToPocketParams {
  distribution: string;
  name: string;
  packages: string[];
  series: string;
}

export interface RemovePackageFiltersFromPocketParams {
  distribution: string;
  name: string;
  packages: string[];
  series: string;
}

export interface AddUploaderGPGKeysToPocketParams {
  distribution: string;
  gpg_keys: string[];
  name: string;
  series: string;
}

export interface RemoveUploaderGPGKeysFromPocketParams {
  distribution: string;
  gpg_keys: string[];
  name: string;
  series: string;
}

export default function usePockets() {
  const queryClient = useQueryClient();
  const authFetch = useFetchOld();

  const createPocketQuery = useMutation<
    AxiosResponse<Pocket>,
    AxiosError<ApiError>,
    CreateMirrorPocketParams | CreatePullPocketParams | CreateUploadPocketParams
  >({
    mutationKey: ["pockets", "create"],
    mutationFn: (params) => authFetch.get("CreatePocket", { params }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["distributions"] }),
  });

  const editPocketQuery = useMutation<
    AxiosResponse<Pocket>,
    AxiosError<ApiError>,
    EditMirrorPocketParams | EditPullPocketParams | EditUploadPocketParams
  >({
    mutationKey: ["pockets", "edit"],
    mutationFn: (params) => authFetch.get("EditPocket", { params }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["distributions"] }),
  });

  const removePocketQuery = useMutation<
    AxiosResponse<void>,
    AxiosError<ApiError>,
    RemovePocketParams
  >({
    mutationKey: ["pockets", "remove"],
    mutationFn: (params) => authFetch.get("RemovePocket", { params }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["distributions"] }),
  });

  const syncMirrorPocketQuery = useMutation<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    SyncMirrorPocketParams
  >({
    mutationKey: ["pocketPackages", "sync"],
    mutationFn: (params) => authFetch.get("SyncMirrorPocket", { params }),
    onSuccess: (_, variables) =>
      Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["pocketPackages", { ...variables }],
        }),
        queryClient.invalidateQueries({ queryKey: ["distributions"] }),
      ]),
  });

  const pullPackagesToPocketQuery = useMutation<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    PullPackagesToPocketParams
  >({
    mutationKey: ["pocketPackages", "pull"],
    mutationFn: (params) => authFetch.get("PullPackagesToPocket", { params }),
    onSuccess: (_, variables) =>
      Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["pocketPackages", { ...variables }],
        }),
        queryClient.invalidateQueries({ queryKey: ["distributions"] }),
      ]),
  });

  const removePackagesFromPocketQuery = useMutation<
    AxiosResponse<void>,
    AxiosError<ApiError>,
    RemovePackagesFromPocketParams
  >({
    mutationKey: ["pocketPackages", "remove"],
    mutationFn: (params) =>
      authFetch.get("RemovePackagesFromPocket", { params }),
    onSuccess: (_, variables) =>
      queryClient.invalidateQueries({
        queryKey: ["pocketPackages", { ...variables }, "list"],
      }),
  });

  const diffPullPocketQuery: QueryFnType<
    AxiosResponse<PackageDiff>,
    DiffPullPocketParams
  > = (queryParams, config = {}) =>
    useQuery<AxiosResponse<PackageDiff>, AxiosError<ApiError>>({
      queryKey: ["pocketPackages", { ...queryParams }, "difference"],
      queryFn: () => authFetch.get("DiffPullPocket", { params: queryParams }),
      ...config,
    });

  const listPocketQuery: QueryFnType<
    AxiosResponse<ApiPaginatedResponse<PackageObject>>,
    ListPocketParams
  > = (queryParams, config = {}) =>
    useQuery<
      AxiosResponse<ApiPaginatedResponse<PackageObject>>,
      AxiosError<ApiError>
    >({
      queryKey: ["pocketPackages", { ...queryParams }, "list"],
      queryFn: () => authFetch.get("ListPocket", { params: queryParams }),
      ...config,
    });

  const addPackageFiltersToPocketQuery = useMutation<
    AxiosResponse<Pocket>,
    AxiosError<ApiError>,
    AddPackageFiltersToPocketParams
  >({
    mutationKey: ["packageFilters", "add"],
    mutationFn: (params) =>
      authFetch.get("AddPackageFiltersToPocket", { params }),
    onSuccess: (_, variables) =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["distributions"] }),
        queryClient.invalidateQueries({
          queryKey: ["pocketPackages", { ...variables }],
        }),
      ]),
  });

  const removePackageFiltersFromPocketQuery = useMutation<
    AxiosResponse<Pocket>,
    AxiosError<ApiError>,
    RemovePackageFiltersFromPocketParams
  >({
    mutationKey: ["packageFilters", "remove"],
    mutationFn: (params) =>
      authFetch.get("RemovePackageFiltersFromPocket", { params }),
    onSuccess: (_, variables) =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["distributions"] }),
        queryClient.invalidateQueries({
          queryKey: ["pocketPackages", { ...variables }],
        }),
      ]),
  });

  const addUploaderGPGKeysToPocketQuery = useMutation<
    AxiosResponse<Pocket>,
    AxiosError<ApiError>,
    AddUploaderGPGKeysToPocketParams
  >({
    mutationKey: ["uploaderGPGKeys", "add"],
    mutationFn: (params) =>
      authFetch.get("AddUploaderGPGKeysToPocket", { params }),
    onSuccess: (_, variables) =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["distributions"] }),
        queryClient.invalidateQueries({
          queryKey: ["pocketPackages", { ...variables }],
        }),
      ]),
  });

  const removeUploaderGPGKeysFromPocketQuery = useMutation<
    AxiosResponse<Pocket>,
    AxiosError<ApiError>,
    RemoveUploaderGPGKeysFromPocketParams
  >({
    mutationKey: ["uploaderGPGKeys", "remove"],
    mutationFn: (params) =>
      authFetch.get("RemoveUploaderGPGKeysFromPocket", { params }),
    onSuccess: (_, variables) =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["distributions"] }),
        queryClient.invalidateQueries({
          queryKey: ["pocketPackages", { ...variables }],
        }),
      ]),
  });

  return {
    createPocketQuery,
    editPocketQuery,
    syncMirrorPocketQuery,
    pullPackagesToPocketQuery,
    diffPullPocketQuery,
    removePocketQuery,
    listPocketQuery,
    removePackagesFromPocketQuery,
    addPackageFiltersToPocketQuery,
    removePackageFiltersFromPocketQuery,
    addUploaderGPGKeysToPocketQuery,
    removeUploaderGPGKeysFromPocketQuery,
  };
}
