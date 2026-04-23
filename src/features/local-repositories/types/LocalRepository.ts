export interface LocalRepository extends Record<string, unknown> {
  name: string;
  local_id: string;
  display_name: string;
  comment?: string;
  distribution: string;
  component: string;
}

export interface LocalPackage {
  name: string;
}

export interface ImportLocalPackagesRequest {
  name: string;
  url: string;
  validate_only?: boolean;
}

export interface ListLocalPackagesRequest {
  repository: string;
  page_size?: number;
  page_token?: string;
}
