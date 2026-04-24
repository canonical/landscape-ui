export interface FormProps {
  name: string;
  source_type: string;
  source: string;
  publication_target: string;
  prefix: string;
  uploader_distribution: string;
  uploader_architectures: string;
  preserve_mirror_signing_key: boolean;
  mirror_signing_key: string;
  hash_indexing: boolean;
  automatic_installation: boolean;
  automatic_upgrades: boolean;
  skip_bz2: boolean;
  skip_content_indexing: boolean;
}

export interface SelectableSource {
  label: string;
  value: string;
  sourceType: string;
  distribution?: string;
  architectures: string[];
}
