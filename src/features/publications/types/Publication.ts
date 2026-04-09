interface Uploader {
  distribution: string;
  components: string[];
  architectures: string[];
}

interface Settings {
  hash_indexing: boolean;
  automatic_installation: boolean;
  automatic_upgrades: boolean;
  skip_bz2: boolean;
  skip_content_indexing: boolean;
}

export interface Publication {
  name: string;
  source_type: string;
  source: string;
  publication_target: string;
  date_published: string;
  prefix: string;

  uploaders: Uploader[];
  settings: Settings;
}
