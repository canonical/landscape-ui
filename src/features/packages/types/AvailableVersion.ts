export interface AvailableVersion {
  name: string;
  num_computers: number;
}

export interface VersionCount {
  versions: AvailableVersion[];
  uninstalled?: number;
  out_of_scope: number;
}
