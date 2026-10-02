export interface ComputerPackageSearchParams {
  available?: boolean;
  held?: boolean;
  installed?: boolean;
  security?: boolean;
  upgrade?: boolean;
  search?: string;
  names?: string[];
  group_by_name?: boolean;
  limit?: number;
  offset?: number;
}

export interface PackageInstallationCandidate {
  id: number;
  version: string;
  upgrade: boolean;
  security: boolean;
}

export interface ComputerPackageSearchGroupedResult {
  name: string;
  summary: string | null;
  installed_version: string | null;
  installed_id: number | null;
  held: boolean;
  security: boolean;
  installation_candidates: PackageInstallationCandidate[];
}

export interface ComputerPackageSearchGroupedResponse {
  count: number;
  results: ComputerPackageSearchGroupedResult[];
}
