export interface GetDistributionsParams {
  names?: string[];
  include_latest_sync?: boolean;
}

export interface CreateDistributionParams {
  name: string;
  access_group?: string;
}

export interface RemoveDistributionParams {
  name: string;
}
