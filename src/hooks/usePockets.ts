import useFetch from "./useFetch";
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
import { PackageDiff, PackagesList } from "../types/Package";

interface CreateCommonPocketParams {
  name: string;
  series: string;
  distribution: string;
  components: string[];
  architectures: string[];
  gpg_key: string;
  include_udeb: boolean;
}

export interface CreateMirrorPocketParams extends CreateCommonPocketParams {
  mode: "mirror";
  mirror_uri: string;
  mirror_suite?: string;
  mirror_gpg_key?: string;
}

export interface CreatePullPocketParams extends CreateCommonPocketParams {
  mode: "pull";
  pull_pocket: string;
  pull_series?: string;
  filter_type?: "whitelist" | "blacklist";
}

export interface CreateUploadPocketParams extends CreateCommonPocketParams {
  mode: "upload";
  upload_allow_unsigned: boolean;
}

interface EditCommonPocketParams {
  name: string;
  series: string;
  distribution: string;
  components: string[];
  architectures: string[];
  gpg_key: string;
  include_udeb?: boolean;
}

export interface EditMirrorPocketParams extends EditCommonPocketParams {
  mirror_uri: string;
  mirror_suite?: string;
  mirror_gpg_key?: string;
}

export interface EditPullPocketParams extends EditCommonPocketParams {}

export interface EditUploadPocketParams extends EditCommonPocketParams {
  upload_allow_unsigned: boolean;
}

interface RemovePocketParams {
  name: string;
  series: string;
  distribution: string;
}

interface SyncMirrorPocketParams {
  name: string;
  series: string;
  distribution: string;
}

interface PullPackagesToPocketParams {
  name: string;
  series: string;
  distribution: string;
}

interface DiffPullPocketParams {
  name: string;
  series: string;
  distribution: string;
}

interface ListPocketParams {
  name: string;
  series: string;
  distribution: string;
}

interface RemovePackagesFromPocketParams {
  name: string;
  series: string;
  distribution: string;
  packages: string[];
}

interface AddPackageFiltersToPocketParams {
  name: string;
  series: string;
  distribution: string;
  packages: string[];
}

interface RemovePackageFiltersFromPocketParams {
  name: string;
  series: string;
  distribution: string;
  packages: string[];
}

interface AddUploaderGPGKeysToPocketParams {
  name: string;
  series: string;
  distribution: string;
  gpg_keys: string[];
}

interface RemoveUploaderGPGKeysFromPocketParams {
  name: string;
  series: string;
  distribution: string;
  gpg_keys: string[];
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
  listPocketQuery: QueryFnType<AxiosResponse<PackagesList>, ListPocketParams>;
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
  const authFetch = useFetch();
  const debug = useDebug();

  const createPocketQuery = useMutation<
    AxiosResponse<Pocket>,
    AxiosError<ApiError>,
    CreateMirrorPocketParams | CreatePullPocketParams | CreateUploadPocketParams
  >({
    mutationKey: ["pockets", "new"],
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
    mutationKey: ["pockets", "mirror"],
    mutationFn: (params) => authFetch!.get("SyncMirrorPocket", { params }),
    onSuccess: () => {
      queryClient.invalidateQueries(["packages"]).catch(debug);
    },
  });

  const pullPackagesToPocketQuery = useMutation<
    AxiosResponse<void>,
    AxiosError<ApiError>,
    PullPackagesToPocketParams
  >({
    mutationKey: ["pockets", "pull"],
    mutationFn: (params) => authFetch!.get("PullPackagesToPocket", { params }),
    onSuccess: () => {
      queryClient.invalidateQueries(["packages"]).catch(debug);
    },
  });

  const removePackagesFromPocketQuery = useMutation<
    AxiosResponse<void>,
    AxiosError<ApiError>,
    RemovePackagesFromPocketParams
  >({
    mutationKey: ["pockets", "pull"],
    mutationFn: (params) =>
      authFetch!.get("RemovePackagesFromPockets", { params }),
    onSuccess: () => {
      queryClient.invalidateQueries(["packages"]).catch(debug);
    },
  });

  const diffPullPocketQuery: QueryFnType<
    AxiosResponse<PackageDiff>,
    DiffPullPocketParams
  > = (queryParams, config = {}) =>
    useQuery<AxiosResponse<PackageDiff>, AxiosError<ApiError>>({
      queryKey: [
        "packages",
        "difference",
        queryParams?.distribution,
        queryParams?.series,
        queryParams?.name,
      ],
      queryFn: () =>
        authFetch!.get("DiffPullPocket", {
          params: queryParams,
        }),
      ...config,
    });

  const listPocketQuery: QueryFnType<
    AxiosResponse<PackagesList>,
    ListPocketParams
  > = (queryParams, config = {}) =>
    useQuery<AxiosResponse<PackagesList>, AxiosError<ApiError>>({
      queryKey: [
        "packages",
        "list",
        queryParams?.distribution,
        queryParams?.series,
        queryParams?.name,
      ],
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
    mutationKey: ["pockets", "pull"],
    mutationFn: (params) =>
      authFetch!.get("AddPackageFiltersToPocket", { params }),
    onSuccess: () => {
      queryClient.invalidateQueries(["packages"]).catch(debug);
    },
  });

  const removePackageFiltersFromPocketQuery = useMutation<
    AxiosResponse<Pocket>,
    AxiosError<ApiError>,
    RemovePackageFiltersFromPocketParams
  >({
    mutationKey: ["pockets", "pull"],
    mutationFn: (params) =>
      authFetch!.get("RemovePackageFiltersFromPocket", { params }),
    onSuccess: () => {
      queryClient.invalidateQueries(["packages"]).catch(debug);
    },
  });

  const addUploaderGPGKeysToPocketQuery = useMutation<
    AxiosResponse<Pocket>,
    AxiosError<ApiError>,
    AddUploaderGPGKeysToPocketParams
  >({
    mutationKey: ["pockets", "upload"],
    mutationFn: (params) =>
      authFetch!.get("AddUploaderGPGKeysToPocket", { params }),
    onSuccess: () => {
      queryClient.invalidateQueries(["packages"]).catch(debug);
    },
  });

  const removeUploaderGPGKeysFromPocketQuery = useMutation<
    AxiosResponse<Pocket>,
    AxiosError<ApiError>,
    RemoveUploaderGPGKeysFromPocketParams
  >({
    mutationKey: ["pockets", "upload"],
    mutationFn: (params) =>
      authFetch!.get("RemoveUploaderGPGKeysFromPocket", { params }),
    onSuccess: () => {
      queryClient.invalidateQueries(["packages"]).catch(debug);
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
