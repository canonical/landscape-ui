import useFetchOld from "./useFetchOld";
import {
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import useDebug from "./useDebug";
import { AxiosError, AxiosResponse } from "axios";
import { ApiError } from "../types/ApiError";
import { Pocket } from "../types/Pocket";
import { QueryFnType } from "../types/QueryFnType";
import { PackageDiff, PackageObject } from "../types/Package";
import { ApiPaginatedResponse } from "../types/ApiPaginatedResponse";

interface CreateCommonPocketParams {
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

interface EditCommonPocketParams {
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

export interface EditPullPocketParams extends EditCommonPocketParams {}

export interface EditUploadPocketParams extends EditCommonPocketParams {
  upload_allow_unsigned: boolean;
}

interface RemovePocketParams {
  distribution: string;
  name: string;
  series: string;
}

interface SyncMirrorPocketParams {
  distribution: string;
  name: string;
  series: string;
}

interface PullPackagesToPocketParams {
  distribution: string;
  name: string;
  series: string;
}

interface DiffPullPocketParams {
  distribution: string;
  name: string;
  series: string;
}

interface ListPocketParams {
  distribution: string;
  limit: number;
  name: string;
  offset: number;
  series: string;
  search?: string;
}

interface RemovePackagesFromPocketParams {
  distribution: string;
  name: string;
  packages: string[];
  series: string;
}

interface AddPackageFiltersToPocketParams {
  distribution: string;
  name: string;
  packages: string[];
  series: string;
}

interface RemovePackageFiltersFromPocketParams {
  distribution: string;
  name: string;
  packages: string[];
  series: string;
}

interface AddUploaderGPGKeysToPocketParams {
  distribution: string;
  gpg_keys: string[];
  name: string;
  series: string;
}

interface RemoveUploaderGPGKeysFromPocketParams {
  distribution: string;
  gpg_keys: string[];
  name: string;
  series: string;
}

interface UsePocketsResult {
  createPocketQuery: UseMutationResult<
    AxiosResponse<Pocket>,
    AxiosError<ApiError>,
    CreateMirrorPocketParams | CreatePullPocketParams | CreateUploadPocketParams
  >;
  editPocketQuery: UseMutationResult<
    AxiosResponse<Pocket>,
    AxiosError<ApiError>,
    EditMirrorPocketParams | EditPullPocketParams | EditUploadPocketParams
  >;
  removePocketQuery: UseMutationResult<
    AxiosResponse<void>,
    AxiosError<ApiError>,
    RemovePocketParams
  >;
  syncMirrorPocketQuery: UseMutationResult<
    AxiosResponse<void>,
    AxiosError<ApiError>,
    SyncMirrorPocketParams
  >;
  pullPackagesToPocketQuery: UseMutationResult<
    AxiosResponse<void>,
    AxiosError<ApiError>,
    PullPackagesToPocketParams
  >;
  diffPullPocketQuery: QueryFnType<
    AxiosResponse<PackageDiff>,
    DiffPullPocketParams
  >;
  listPocketQuery: QueryFnType<
    AxiosResponse<ApiPaginatedResponse<PackageObject>>,
    ListPocketParams
  >;
  removePackagesFromPocketQuery: UseMutationResult<
    AxiosResponse<void>,
    AxiosError<ApiError>,
    RemovePackagesFromPocketParams
  >;
  addPackageFiltersToPocketQuery: UseMutationResult<
    AxiosResponse<Pocket>,
    AxiosError<ApiError>,
    AddPackageFiltersToPocketParams
  >;
  removePackageFiltersFromPocketQuery: UseMutationResult<
    AxiosResponse<Pocket>,
    AxiosError<ApiError>,
    RemovePackageFiltersFromPocketParams
  >;
  addUploaderGPGKeysToPocketQuery: UseMutationResult<
    AxiosResponse<Pocket>,
    AxiosError<ApiError>,
    AddUploaderGPGKeysToPocketParams
  >;
  removeUploaderGPGKeysFromPocketQuery: UseMutationResult<
    AxiosResponse<Pocket>,
    AxiosError<ApiError>,
    RemoveUploaderGPGKeysFromPocketParams
  >;
}

export default function usePockets(): UsePocketsResult {
  const queryClient = useQueryClient();
  const authFetch = useFetchOld();
  const debug = useDebug();

  const createPocketQuery = useMutation<
    AxiosResponse<Pocket>,
    AxiosError<ApiError>,
    CreateMirrorPocketParams | CreatePullPocketParams | CreateUploadPocketParams
  >({
    mutationKey: ["pockets", "create"],
    mutationFn: (params) => authFetch!.get("CreatePocket", { params }),
    onSuccess: () => {
      queryClient.invalidateQueries(["distributions"]).catch(debug);
    },
  });

  const editPocketQuery = useMutation<
    AxiosResponse<Pocket>,
    AxiosError<ApiError>,
    EditMirrorPocketParams | EditPullPocketParams | EditUploadPocketParams
  >({
    mutationKey: ["pockets", "edit"],
    mutationFn: (params) => authFetch!.get("EditPocket", { params }),
    onSuccess: () => {
      queryClient.invalidateQueries(["distributions"]).catch(debug);
    },
  });

  const removePocketQuery = useMutation<
    AxiosResponse<void>,
    AxiosError<ApiError>,
    RemovePocketParams
  >({
    mutationKey: ["pockets", "remove"],
    mutationFn: (params) => authFetch!.get("RemovePocket", { params }),
    onSuccess: () => {
      queryClient.invalidateQueries(["distributions"]).catch(debug);
    },
  });

  const syncMirrorPocketQuery = useMutation<
    AxiosResponse<void>,
    AxiosError<ApiError>,
    SyncMirrorPocketParams
  >({
    mutationKey: ["pocketPackages", "sync"],
    mutationFn: (params) => authFetch!.get("SyncMirrorPocket", { params }),
    onSuccess: (data, variables) => {
      queryClient
        .invalidateQueries(["pocketPackages", { ...variables }])
        .catch(debug);
    },
  });

  const pullPackagesToPocketQuery = useMutation<
    AxiosResponse<void>,
    AxiosError<ApiError>,
    PullPackagesToPocketParams
  >({
    mutationKey: ["pocketPackages", "pull"],
    mutationFn: (params) => authFetch!.get("PullPackagesToPocket", { params }),
    onSuccess: (data, variables) => {
      queryClient
        .invalidateQueries(["pocketPackages", { ...variables }])
        .catch(debug);
    },
  });

  const removePackagesFromPocketQuery = useMutation<
    AxiosResponse<void>,
    AxiosError<ApiError>,
    RemovePackagesFromPocketParams
  >({
    mutationKey: ["pocketPackages", "remove"],
    mutationFn: (params) =>
      authFetch!.get("RemovePackagesFromPocket", { params }),
    onSuccess: (data, variables) => {
      queryClient
        .invalidateQueries(["pocketPackages", { ...variables }, "list"])
        .catch(debug);
    },
  });

  const diffPullPocketQuery: QueryFnType<
    AxiosResponse<PackageDiff>,
    DiffPullPocketParams
  > = (queryParams, config = {}) =>
    useQuery<AxiosResponse<PackageDiff>, AxiosError<ApiError>>({
      queryKey: ["pocketPackages", { ...queryParams }, "difference"],
      queryFn: () =>
        authFetch!.get("DiffPullPocket", {
          params: queryParams,
        }),
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
      queryFn: () =>
        authFetch!.get("ListPocket", {
          params: queryParams,
        }),
      ...config,
    });

  const addPackageFiltersToPocketQuery = useMutation<
    AxiosResponse<Pocket>,
    AxiosError<ApiError>,
    AddPackageFiltersToPocketParams
  >({
    mutationKey: ["packageFilters", "add"],
    mutationFn: (params) =>
      authFetch!.get("AddPackageFiltersToPocket", { params }),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(["distributions"]).catch(debug);
      queryClient
        .invalidateQueries(["pocketPackages", { ...variables }])
        .catch(debug);
    },
  });

  const removePackageFiltersFromPocketQuery = useMutation<
    AxiosResponse<Pocket>,
    AxiosError<ApiError>,
    RemovePackageFiltersFromPocketParams
  >({
    mutationKey: ["packageFilters", "remove"],
    mutationFn: (params) =>
      authFetch!.get("RemovePackageFiltersFromPocket", { params }),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(["distributions"]).catch(debug);
      queryClient
        .invalidateQueries(["pocketPackages", { ...variables }])
        .catch(debug);
    },
  });

  const addUploaderGPGKeysToPocketQuery = useMutation<
    AxiosResponse<Pocket>,
    AxiosError<ApiError>,
    AddUploaderGPGKeysToPocketParams
  >({
    mutationKey: ["uploaderGPGKeys", "add"],
    mutationFn: (params) =>
      authFetch!.get("AddUploaderGPGKeysToPocket", { params }),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(["distributions"]).catch(debug);
      queryClient
        .invalidateQueries(["pocketPackages", { ...variables }])
        .catch(debug);
    },
  });

  const removeUploaderGPGKeysFromPocketQuery = useMutation<
    AxiosResponse<Pocket>,
    AxiosError<ApiError>,
    RemoveUploaderGPGKeysFromPocketParams
  >({
    mutationKey: ["uploaderGPGKeys", "remove"],
    mutationFn: (params) =>
      authFetch!.get("RemoveUploaderGPGKeysFromPocket", { params }),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(["distributions"]).catch(debug);
      queryClient
        .invalidateQueries(["pocketPackages", { ...variables }])
        .catch(debug);
    },
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
