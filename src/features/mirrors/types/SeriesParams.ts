export interface CreateSeriesParams {
  distribution: string;
  include_udeb: boolean;
  name: string;
  architectures?: string[];
  components?: string[];
  gpg_key?: string;
  mirror_gpg_key?: string;
  mirror_series?: string;
  mirror_uri?: string;
  pockets?: string[];
}

export interface DeriveSeriesParams {
  distribution: string;
  name: string;
  origin: string;
}

export interface RemoveSeriesParams {
  distribution: string;
  name: string;
}

export interface GetRepoInfoParams {
  mirror_uri: string;
}
