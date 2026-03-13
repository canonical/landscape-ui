export interface AvailableVersion {
  name: string;
  num_computers: number;
}

export interface VersionCount {
  versions: AvailableVersion[];
  uninstalled?: number;
  out_of_scope: number;
}

export interface DowngradeVersion {
  name: string;
  num_computers: number;
  downgrades: AvailableVersion[];
}

export interface DowngradeVersionCount {
  versions: DowngradeVersion[];
  out_of_scope: number;
}
