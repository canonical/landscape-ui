import type { Activity } from "@/features/activities";
import type { PackageDiff, PackageObject } from "@/features/packages";
import useFetchOld from "@/hooks/useFetchOld";
import type { ApiError } from "@/types/ApiError";
import type { ApiPaginatedResponse } from "@/types/ApiPaginatedResponse";
import type { QueryFnType } from "@/types/QueryFnType";
import type { UseMutationResult } from "@tanstack/react-query";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
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
  Pocket,
  PullPackagesToPocketParams,
  RemovePackageFiltersFromPocketParams,
  RemovePackagesFromPocketParams,
  RemovePocketParams,
  RemoveUploaderGPGKeysFromPocketParams,
  SyncMirrorPocketParams,
} from "../types";

export default function usePockets(): {
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
} {
  const queryClient = useQueryClient();
  const authFetch = useFetchOld();

  const createPocketQuery = useMutation<
    AxiosResponse<Pocket>,
    AxiosError<ApiError>,
    CreateMirrorPocketParams | CreatePullPocketParams | CreateUploadPocketParams
  >({
    mutationKey: ["pockets", "create"],
    mutationFn: async (params) => authFetch.get("CreatePocket", { params }),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["distributions"] }),
  });

  const editPocketQuery = useMutation<
    AxiosResponse<Pocket>,
    AxiosError<ApiError>,
    EditMirrorPocketParams | EditPullPocketParams | EditUploadPocketParams
  >({
    mutationKey: ["pockets", "edit"],
    mutationFn: async (params) => authFetch.get("EditPocket", { params }),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["distributions"] }),
  });

  const removePocketQuery = useMutation<
    AxiosResponse<void>,
    AxiosError<ApiError>,
    RemovePocketParams
  >({
    mutationKey: ["pockets", "remove"],
    mutationFn: async (params) => authFetch.get("RemovePocket", { params }),
    onSuccess: async () =>
      queryClient.invalidateQueries({ queryKey: ["distributions"] }),
  });

  const syncMirrorPocketQuery = useMutation<
    AxiosResponse<Activity>,
    AxiosError<ApiError>,
    SyncMirrorPocketParams
  >({
    mutationKey: ["pocketPackages", "sync"],
    mutationFn: async (params) => authFetch.get("SyncMirrorPocket", { params }),
    onSuccess: async (_, variables) =>
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
    mutationFn: async (params) =>
      authFetch.get("PullPackagesToPocket", { params }),
    onSuccess: async (_, variables) =>
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
    mutationFn: async (params) =>
      authFetch.get("RemovePackagesFromPocket", { params }),
    onSuccess: async (_, variables) =>
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
      queryFn: async () =>
        authFetch.get("DiffPullPocket", { params: queryParams }),
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
      queryFn: async () => authFetch.get("ListPocket", { params: queryParams }),
      ...config,
    });

  const addPackageFiltersToPocketQuery = useMutation<
    AxiosResponse<Pocket>,
    AxiosError<ApiError>,
    AddPackageFiltersToPocketParams
  >({
    mutationKey: ["packageFilters", "add"],
    mutationFn: async (params) =>
      authFetch.get("AddPackageFiltersToPocket", { params }),
    onSuccess: async (_, variables) =>
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
    mutationFn: async (params) =>
      authFetch.get("RemovePackageFiltersFromPocket", { params }),
    onSuccess: async (_, variables) =>
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
    mutationFn: async (params) =>
      authFetch.get("AddUploaderGPGKeysToPocket", { params }),
    onSuccess: async (_, variables) =>
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
    mutationFn: async (params) =>
      authFetch.get("RemoveUploaderGPGKeysFromPocket", { params }),
    onSuccess: async (_, variables) =>
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
