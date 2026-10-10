export enum FilterState {
  UNSPECIFIED = "unspecified",
  TRUE = "true",
  FALSE = "false",
}

export interface SearchUpgradesRequest {
  computer_query: string;
  text?: string;
  names?: string[];
  security?: FilterState;
  limit?: number;
  offset?: number;
}

export interface PackageComputersResponse {
  count: number;
}

export interface PackageSearchResultPackage {
  id: number;
  name: string;
  summary: string;
  version: string;
  computers: PackageComputersResponse;
  usn?: {
    id: string;
    summary?: string | null;
  } | null;
  cves?: { id: string }[];
}

export interface SearchPackagesResponse {
  packages: PackageSearchResultPackage[];
  count: number;
  prev: string | null;
  next: string | null;
}
