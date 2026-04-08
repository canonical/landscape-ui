export interface AutoinstallFile extends Record<string, unknown> {
  contents: string;
  created_at: string;
  filename: string;
  id: number;
  is_default: boolean;
  last_modified_at: string;
  version: number;
}

export interface AutoinstallFileVersionInfo extends Record<string, unknown> {
  version: number;
  created_at: string;
}

export type WithMetadata<T extends AutoinstallFile> = T & {
  metadata: {
    current_version: number;
    max_versions: number;
    versions: AutoinstallFileVersionInfo[];
  };
};
