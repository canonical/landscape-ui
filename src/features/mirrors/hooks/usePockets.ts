import { Activity } from "@/features/activities";
import { PackageDiff, PackageObject } from "@/features/packages";
import useFetchOld from "@/hooks/useFetchOld";
import { ApiError } from "@/types/ApiError";
import { ApiPaginatedResponse } from "@/types/ApiPaginatedResponse";
import { QueryFnType } from "@/types/QueryFnType";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import {
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
