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
